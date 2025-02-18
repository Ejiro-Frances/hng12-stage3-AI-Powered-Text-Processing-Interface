import { useState } from "react";
// import axios from "axios";

const TextInput = () => {
  // State to store the input text
  const [inputText, setInputText] = useState("");

  // State to store an array of displayed messages
  const [messages, setMessages] = useState([]);

  // State to detect language
  const [detectedLanguage, setDetectedLanguage] = useState("");

  const [loading, setLoading] = useState(false);

  let detector;

  // Function to check if the AI language detector is available
  const initializeLanguageDetector = async () => {
    if (!self.ai || !self.ai.languageDetector) {
      console.error(
        "AI Language Detector API is not supported in this browser."
      );
      return null;
    }

    const languageDetectorCapabilities =
      await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.capabilities;

    if (canDetect === "no") {
      console.error("Language detection is not available.");
      return null;
    }

    if (canDetect === "readily") {
      return await self.ai.languageDetector.create();
    } else {
      const detector = await self.ai.languageDetector.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
      await detector.ready;
      return detector;
    }
  };

  // Function to handle typing in the textarea
  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  // Function to detect language and display it
  const handleProcessText = async () => {
    if (inputText.trim() === "") return; // Prevent empty submissions

    setLoading(true);

    // Initialize the language detector
    detector = await initializeLanguageDetector();
    if (!detector) {
      setLoading(false);
      return;
    }

    // Detect language
    const results = await detector.detect(inputText);
    const mostLikelyLanguage =
      results.length > 0 ? results[0].detectedLanguage : "Unknown";

    setDetectedLanguage(mostLikelyLanguage);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, language: mostLikelyLanguage },
    ]);

    // Function to create a new message div when button is clicked
    // const handleClick = () => {
    //   if (inputText.trim() === "") return; // Prevent adding empty messages

    // setMessages((prevMessages) => [...prevMessages, inputText]); // Add new message to array
    setInputText(""); // Clear input field after submission
    setLoading(false);
  };

  // const fetchPosts = async () => {
  //   const languageDetectorCapabilities =
  //     await self.ai.languageDetector.capabilities();
  //   const canDetect = languageDetectorCapabilities.capabilities;
  //   let detector;
  //   if (canDetect === "no") {
  //     // The language detector isn't usable.
  //     return;
  //   }

  //   if (canDetect === "readily") {
  //     // The language detector can immediately be used.
  //     detector = await self.ai.languageDetector.create();
  //   } else {
  //     // The language detector can be used after model download.
  //     detector = await self.ai.languageDetector.create({
  //       monitor(m) {
  //         m.addEventListener("downloadprogress", (e) => {
  //           console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
  //         });
  //       },
  //     });
  //     await detector.ready;
  //   }
  // };

  // fetchPosts();

  return (
    <section>
      {/* Display All Messages */}
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <div className="output-container">
              <p>{message.text}</p>
            </div>
            <button>Detected Language: {message.language}</button>
          </div>
        ))}
      </div>

      {/* Text Input and Button */}
      <div>
        <textarea
          className="input-container text-input"
          id="textInput"
          placeholder="Write your message here..."
          onChange={handleChange}
          value={inputText}
        ></textarea>
        {/* Button to submit text */}
        <button
          onClick={handleProcessText}
          style={{
            background: "white",
            width: "50px",
            height: "40px",
            border: "1px solid black",
            cursor: "pointer",
          }}
        >
          {/* SVG Icon (Arrow) */}
          {/* <svg
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
          </svg> */}
          {loading ? (
            "Detecting .."
          ) : (
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
          )}
        </button>
      </div>
    </section>
  );
};

export default TextInput;

// import { useState } from "react";

// const TextInput = () => {
//   const [text, setText] = useState("");
//   const handleClick = () => {
//     setText();
//   };
//   const handleChange = (event) => {
//     setText(event.target.value);
//   };

//   return (
//     <section>
//       <div>
//         <h1>{text}</h1>
//       </div>

//       <div>
//         <textarea
//           className="input-container text-input"
//           id="textInput"
//           placeholder="Write your message here..."
//           onChange={handleChange}
//           value={text}
//         ></textarea>
//         <button
//           onClick={handleClick}
//           style={{ background: "white", width: "40px" }}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="#000000"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="#000"
//             className="size-6"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
//             />
//           </svg>
//         </button>
//       </div>
//     </section>
//   );
// };

// export default TextInput;
