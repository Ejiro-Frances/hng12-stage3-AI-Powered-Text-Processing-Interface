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

  // Function to create a new message div when button is clicked
  const handleClick = () => {
    if (inputText.trim() === "") return; // Prevent adding empty messages

    setMessages((prevMessages) => [...prevMessages, inputText]); // Add new message to array
    setInputText(""); // Clear input field after submission
    // setLoading(false);
  };

  // Function to handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents new line in textarea
      handleClick(); // Calls the submit function
    }
  };

  return (
    <section>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <div className="message-output">
              <p>{message}</p>
            </div>
            {/* <button>Detected Language: {message.language}</button> */}
          </div>
        ))}
      </div>

      <div className="input-container">
        <textarea
          className="message-input text-input"
          placeholder="Enter your message here.."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={inputText}
        ></textarea>
        {/* Button to submit text */}
        <button onClick={handleClick}>
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
