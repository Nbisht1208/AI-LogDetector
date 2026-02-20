
import axios from "axios";

const AI_URL = "http://localhost:8001/analyze";

// Retry logic
async function analyzeWithRetry(logs, retries = 3, delay = 1000) {
  while (retries > 0) {
    try {
      const res = await axios.post(AI_URL, logs);
      return res.data;
    } catch (err) {
      console.log(`AI service failed. Retries left: ${retries - 1}`);

      retries--;

      if (retries === 0) {
        throw new Error("AI service unreachable after retries");
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export { analyzeWithRetry };


// export const analyzeWithAI = async (logs) => {
//   try {
//     const res = await axios.post("http://localhost:8001/analyze", logs);//ai microservice ka endpoint hai 
//     return res.data;
//   } catch (err) {
//     console.error("AI service error:", err.message);
//     throw new Error("AI service unavailable");
//   }
// };
