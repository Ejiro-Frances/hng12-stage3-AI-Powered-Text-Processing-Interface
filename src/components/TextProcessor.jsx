import { useState } from "react";

const TextProcessor = () => {
  // State to store the input text
  const [inputText, setInputText] = useState("");

  // State to store an array of displayed messages
  const [messages, setMessages] = useState([]);

  // Function to handle typing in the textarea
  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleProcessText = async () => {
    if (inputText.trim() === "") return;

    const languageDetectorCapabilities =
      await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.capabilities;
    let detector;

    if (canDetect === "no") {
      console.error("Language detection is not available.");
      return;
    }

    if (canDetect === "readily") {
      detector = await self.ai.languageDetector.create();
    } else {
      detector = await self.ai.languageDetector.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
      await detector.ready;
    }

    // Detect the language
    const results = await detector.detect(inputText);
    const detectedLanguage =
      results.length > 0 ? results[0].detectedLanguage : "Unknown";

    // Add new message with detected language (Fixed state update)
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, language: detectedLanguage },
    ]);

    setInputText(""); // Clear input field after submission
  };

  // Function to handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents new line in textarea
      handleProcessText();
    }
  };

  return (
    <section>
      {/* Output Messages */}
      <div>
        {messages.map((message, index) => (
          <div key={index} className="message-output">
            <p>{message.text}</p>
            <p>Detected Language: {message.language.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="input-container">
        <textarea
          className="message-input text-input"
          placeholder="Enter your message here..."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={inputText}
        ></textarea>

        {/* Button to submit text */}
        <button onClick={handleProcessText}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
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
