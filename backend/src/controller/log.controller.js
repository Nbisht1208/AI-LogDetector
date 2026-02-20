import LogFile from "../models/LogFile.model.js";
import { parseLogFile, extractMetadata } from "../utilis/parseLog.js";
import Log from "../models/log.model.js";
// import { analyzeWithAI } from "../services/ai.service.js";


// Upload log
export const uploadLog = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id; // from JWT middleware

    const log = await LogFile.create({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      userId
    });

    res.json({ fileId: log._id, msg: "File uploaded" });
  } catch (err) {
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
};

// Parse log file
export const parseLog = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await LogFile.findById(fileId);
    if (!file) return res.status(404).json({ msg: "File not found" });

    file.status = "parsing";
    await file.save();

    let parsedLines = 0;
    const totalLines = await parseLogFile(file.path, async (line) => {
      const meta = extractMetadata(line);

      await Log.create({
        fileId: fileId,
        timestamp: meta.timestamp ? new Date(meta.timestamp) : null,
        severity: meta.severity,
        ip: meta.ip,
        user: meta.user,
        endpoint: meta.endpoint,
        message: line,
        rawLine: line
      });

      // console.log(metadata); // later: save metadata to DB
      parsedLines++;
    });

    file.status = "completed";
    file.totalLines = totalLines;
    file.parsedLines = parsedLines;
    await file.save();

    res.json({ msg: "Parsing completed", fileId });
  } catch (err) {
    res.status(500).json({ msg: "Parsing failed", error: err.message });
  }
};

// Check file status
export const getFileStatus = async (req, res) => {
  const { fileId } = req.params;
  const file = await LogFile.findById(fileId);

  if (!file) return res.status(404).json({ msg: "File not found" });

  res.json({
    status: file.status,
    totalLines: file.totalLines,
    parsedLines: file.parsedLines
  });
};


// Analyze logs with AI
// export const analyzeLogs = async (req, res, next) => {
//   try {
//     const logs = await Log.find().limit(100);

//     const result = await analyzeWithAI(logs);

//     res.json({
//       success: true,
//       ai: result,
//     });
//   } catch (err) {
//     console.error("analyzeLogs error:", err);

//     // custom status code
//     const status = err.statusCode || 500;

//     res.status(status).json({
//       success: false,
//       message: err.message || "Something went wrong while analyzing logs",
//     });

//   }
// };
