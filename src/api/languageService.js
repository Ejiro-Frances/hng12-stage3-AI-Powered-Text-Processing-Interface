export const initializeChromeAI = async (setLoading) => {
  if (!self.ai || !self.ai.languageDetector || !self.ai.translator) {
    console.error("Chrome AI API is not available in this browser.");
    return { detector: null, translator: null };
  }

  setLoading(true); // Show loading spinner

  // Initialize the language detector
  const languageDetectorCapabilities =
    await self.ai.languageDetector.capabilities();
  const canDetect = languageDetectorCapabilities.capabilities;

  if (canDetect === "no") {
    console.error("Language detection is not available.");
    setLoading(false);
    return { detector: null, translator: null };
  }

  let detector;

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

  // Initialize AI Translator
  const translator = await self.ai.translator.create();

  setLoading(false); // Hide loading spinner

  return { detector, translator };
};

// import axios from "axios";

// const API_KEY = "YOUR_GOOGLE_TRANSLATE_API_KEY"; // Replace with your API key
// const API_URL = `https://translation.googleapis.com/language/translate/v2/detect?key=${API_KEY}`;

// export const detectLanguage = async (text) => {
//   try {
//     const response = await axios.post(API_URL, { q: text });

//     if (
//       response.data &&
//       response.data.data &&
//       response.data.data.detections.length > 0
//     ) {
//       return response.data.data.detections[0][0].language; // Returns detected language code
//     } else {
//       return "Unknown";
//     }
//   } catch (error) {
//     console.error("Error detecting language:", error);
//     return "Unknown";
//   }
// };
