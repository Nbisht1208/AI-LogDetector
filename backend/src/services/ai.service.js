
import axios from "axios";

// const AI_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000/analyze";
// const AI_URL = process.env.AI_SERVICE_URL 
//   ? `${process.env.AI_SERVICE_URL}/analyze`
//   : "http://localhost:8001/analyze";
// const AI_URL = process.env.AI_SERVICE_URL 
//   ? `${process.env.AI_SERVICE_URL}/analyze`
//   : "http://127.0.0.1:8000/analyze";
// const AI_URL = "http://host.docker.internal:8000/analyze";
const AI_URL = process.env.AI_SERVICE_URL 
  ? `${process.env.AI_SERVICE_URL}/analyze`
  : "http://127.0.0.1:8000/analyze";
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
export const analyzeLogs = async (req, res) => {
  try {
    const { fileId } = req.params;
    const logs = await Log.find({ fileId }).limit(100);

    if (!logs.length) return res.status(404).json({ msg: "No logs found" });

    const formatted = logs.map(l => ({
      ip: l.ip || "unknown",
      endpoint: l.endpoint || "unknown",
      severity: l.severity || "INFO",
      message: l.message || ""
    }));

    const result = await analyzeWithRetry(formatted);
    res.json({ success: true, ai: result });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
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
