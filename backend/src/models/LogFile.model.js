import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String, 
  status: { type: String, default: "uploaded" }, // uploaded | parsing | completed
  size: Number,
  totalLines: { type: Number, default: 0 },
  parsedLines: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
FileSchema.index({ userId: 1, status: 1 });
FileSchema.index({ createdAt: -1 });

export default mongoose.model("LogFile", FileSchema);
