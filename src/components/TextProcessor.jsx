import { useEffect, useState } from "react";

const TextProcessor = () => {
  const [inputText, setInputText] = useState(""); // User input text
  const [messages, setMessages] = useState([]); // Stores processed messages
  const [errorMessage, setErrorMessage] = useState(""); // Error state

  const [isSupported, setIsSupported] = useState(false); // Browser compatibility
  const [detector, setDetector] = useState(null); // Language detector
  const [detectedLanguage, setDetectedLanguage] = useState(""); // Stores detected language

  const [translator, setTranslator] = useState(""); // Translator instance
  const [targetLanguage, setTargetLanguage] = useState(""); // Default target language

  const [summarizer, setSummarizer] = useState(null);
  const [charCount, setCharCount] = useState(0); //To count the characters

  const [warningMessage, setWarningMessage] = useState(""); //device warning

  // Language code to full name mapping
  const languageMap = {
    en: "English",
    pt: "Portuguese",
    es: "Spanish",
    ru: "Russian",
    tr: "Turkish",
    fr: "French",
  };

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);
    const isChrome = /chrome/i.test(userAgent) && !/edg/i.test(userAgent); // Exclude Edge browser

    if (isMobile || !isChrome) {
      setWarningMessage(
        "For the best experience, please use a laptop with Google Chrome."
      );
    }
  }, []);

  // Effect to initialize AI APIs
  useEffect(() => {
    const initializeAPIs = async () => {
      try {
        // Initialize Language Detector
        if ("ai" in self && "languageDetector" in self.ai) {
          setIsSupported(true);
          const capabilities = await self.ai.languageDetector.capabilities();

          if (capabilities.capabilities === "no") {
            setErrorMessage("Language detection is not available.");
            return;
          }

          const newDetector =
            capabilities.capabilities === "readily"
              ? await self.ai.languageDetector.create()
              : await self.ai.languageDetector.create({
                  monitor(m) {
                    m.addEventListener("downloadprogress", (e) => {
                      console.log(
                        `Downloaded ${e.loaded} of ${e.total} bytes.`
                      );
                    });
                  },
                });

          await newDetector.ready;
          setDetector(newDetector);
        } else {
          setIsSupported(false);
          setErrorMessage("Language Detector AI is not available.");
        }

        // Initialize Translator
        if ("ai" in self && "translator" in self.ai) {
          const translatorCapabilities =
            await self.ai.translator.capabilities();

          if (translatorCapabilities.capabilities === "no") {
            setErrorMessage("Translation is not available.");
            return;
          }

          const newTranslator = await self.ai.translator.create({
            sourceLanguage: detectedLanguage || "en",
            targetLanguage,
          });

          await newTranslator.ready;
          setTranslator(newTranslator);
        } else {
          setErrorMessage("Translation AI is not available.");
        }

        // For summary
        if ("ai" in self && "summarizer" in self.ai) {
          const summarizerCapabilities =
            await self.ai.summarizer.capabilities();

          if (summarizerCapabilities.available === "no") {
            // The Summarizer API isn't usable.
            setErrorMessage("Summarizer is not available.");
            return;
          }

          const options = {
            sharedContext: "This is a scientific article",
            type: "key-points",
            format: "markdown",
            length: "short",
          };

          let summarizerInstance;

          if (summarizerCapabilities.available === "readily") {
            // The Summarizer API can be used immediately .
            summarizerInstance = await self.ai.summarizer.create(options);
          } else {
            // The Summarizer API can be used after the model is downloaded.
            summarizerInstance = await self.ai.summarizer.create(options);
            summarizerInstance.addEventListener("downloadprogress", (e) => {
              console.log(
                `Downloading Summarizer Model: ${e.loaded} / ${e.total}`
              );
            });
            await summarizerInstance.ready;
          }
          setSummarizer(summarizerInstance);
        } else {
          setErrorMessage("Summarizer API is not supported.");
        }
      } catch (error) {
        setErrorMessage("Failed to initialize AI: " + error.message);
      }
    };

    initializeAPIs();
  }, [detectedLanguage, targetLanguage, summarizer]);

  // Function to detect language
  const detectLanguage = async (text) => {
    if (!detector) {
      setErrorMessage("Language detector is not initialized.");
      return;
    }

    try {
      const results = await detector.detect(text);
      if (results.length > 0) {
        const detectedCode = results[0].detectedLanguage;
        setDetectedLanguage(detectedCode); // Stores detected language in state
        return {
          code: detectedCode,
        };
      }
    } catch (error) {
      setErrorMessage("Language detection failed: " + error.message);
    }

    return { code: "Unavailable", confidence: 0 };
  };

  // Function to translate text
  const translateText = async (text) => {
    if (!translator) {
      setErrorMessage("Translator is not initialized.");
      return;
    }

    try {
      return await translator.translate(text);
    } catch (error) {
      setErrorMessage("Translation failed: " + error.message);
    }

    return null;
  };

  // Function to summarize
  const summarizeText = async (text, index) => {
    if (!summarizer) {
      setErrorMessage("Summarizer is not initialized");
      return;
    }

    // Set isSummarizing to true before processing
    setMessages((prevMessages) =>
      prevMessages.map((msg, i) =>
        i === index
          ? msg.summary
            ? msg
            : { ...msg, isSummarizing: true }
          : msg
      )
    );

    try {
      const summary = await summarizer.summarize(text);

      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index ? { ...msg, summary, isSummarizing: false } : msg
        )
      );
    } catch (error) {
      setErrorMessage("Summarization failed: " + error.message);
      // Reset isSummarizing to false in case of an error
      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index ? { ...msg, isSummarizing: false } : msg
        )
      );
    }
  };

  // Handle text input
  const handleTextChange = (event) => {
    setInputText(event.target.value);
    setCharCount(event.target.value.length);
  };

  // Process text (detect language & store)
  const handleProcessText = async () => {
    if (inputText.trim() === "") {
      setErrorMessage("Please enter text.");
      return;
    }

    setErrorMessage(""); // Clear previous errors

    const { code, confidence } = await detectLanguage(inputText);
    const fullLanguage = languageMap[code] || code;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: inputText,
        detectedLanguage: fullLanguage,
        confidence,
        translations: {}, // Stores multiple translations
      },
    ]);

    setInputText(""); // Clear input field
    setCharCount(0); //set character count
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleProcessText();
    }
  };

  // Handle translation button click
  const handleTranslateButtonClick = async (message, index) => {
    if (!message || !message.text) {
      console.error("Invalid message object:", message);
      return;
    }

    const translated = await translateText(message.text);

    if (translated) {
      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === index
            ? {
                ...msg,
                translations: {
                  ...msg.translations,
                  [targetLanguage]: translated,
                },
              }
            : msg
        )
      );
    }
  };

  return (
    <section>
      {warningMessage && <p className="warning-message">{warningMessage}</p>}
      {!isSupported && <p className="error-message">{errorMessage}</p>}

      <div className="output-container">
        {messages.map((message, index) => (
          <div key={index} className="message-output-container">
            <div className="message-output">
              <p className="message-text">{message.text}</p>
              <div className="btn-div">
                <span className="language">{message.detectedLanguage}</span>
                <span className="translate-to">Translate to :</span>
                <select
                  className="language-select"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                >
                  {Object.entries(languageMap).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>

                <button
                  className="btn"
                  onClick={() => handleTranslateButtonClick(message, index)}
                >
                  Translate
                </button>
                {/* Show the "Summarize" button only if the text is 150+ characters and in English */}
                {message.text.length >= 150 &&
                  message.detectedLanguage === "English" && (
                    <button
                      className="btn"
                      onClick={() => summarizeText(message.text, index)}
                      disabled={message.isSummarizing || message.summary}
                    >
                      {message.isSummarizing
                        ? "Summarizing..."
                        : message.summary
                        ? "Summarized"
                        : "Summarize"}
                    </button>
                  )}
              </div>

              {message.isSummarizing && (
                <p className="spinner">⏳ Summarizing...</p>
              )}
            </div>
            {/* first div ends here */}

            {/* second begins here */}
            {(Object.keys(message.translations).length > 0 ||
              message.summary) && (
              <div className="output-second-box">
                <p>
                  {Object.entries(message.translations).map(
                    ([lang, translation]) => (
                      <p key={lang}>
                        <span className="title">
                          {languageMap[lang] || lang}:
                        </span>
                        {translation}
                      </p>
                    )
                  )}
                  {message.summary && (
                    <p>
                      <span className="title">Summary:</span>
                      {message.summary.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </p>
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input container */}
      <div className="input-container">
        {/* Error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <textarea
          className="message-input"
          value={inputText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter text here..."
        ></textarea>
        <span className="char-count"> {charCount}</span>

        <button className="send-btn" onClick={handleProcessText}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#001f3f"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#000"
            className="size-6"
            width="24px"
            height="24px"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default TextProcessor;
