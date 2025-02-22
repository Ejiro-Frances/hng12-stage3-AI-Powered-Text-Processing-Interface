# Project Name: Text Processing Interface

## Overview

This project is built as HNG12's stage 3 task for frontend developers.

The goal was to develop, build and host an AI-Powered Text Processing Interface using Chrome's AI APIs. The application will allow users to input text and utilize features such as summarization, translation, and language detection. Users should be able to interact with a clean, responsive UI that ensures accessibility and provides meaningful feedback for errors.

### NB:

The Summarize button should only render for output texts that are in English language and if the output text is more than 150 characters.

### Description

The Text Processing Interface App is a simple web application that allows users to input text, which is then translated into different languages and summarized. The translated and summarized content is displayed in a structured format. The app is built using React for the frontend and integrates with APIs for language detection, translation and summarization.

## Features

- Accepts user input text
- Detects the language of the input text
- Translates text to either English(en), Portuguese (pt), Spanish (es), Russian (ru), Turkish (tr) or French (fr)
- Summarizes the text if the detected language is English and input is more than 150 characters
- Displays translated and summarized text dynamically
- Handles error and provides meaningful feedback

## Technologies Used

- React.js
- API Integration

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (v14+ recommended)
- npm or yarn

### Steps to Install

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/translation-summarization-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd translation-summarization-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Usage

### How to Use

1. Enter text in the input box.
2. Click the "Translate" button to translate into available languages.
3. Click the "Summarize" button to get a summary.
4. The translated and summarized text will appear in the second output box.

## Future Improvements

- Add more language support
- Improve UI/UX with animations
- Implement user authentication
- Save translation history for users
- Implement edit and delete features for input text

## Contributing

If you'd like to contribute, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
