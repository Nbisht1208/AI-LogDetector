import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  fileId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, index: true },
  severity: { type: String, index: true },  
  ip: { type: String, index: true },
  user: { type: String },
  endpoint: { type: String, index: true },
  message: String,
  rawLine: String
}, { timestamps: true });

LogSchema.index({ timestamp: 1 });
LogSchema.index({ severity: 1 });
LogSchema.index({ ip: 1 });
LogSchema.index({ endpoint: 1 });

export default mongoose.model("Log", LogSchema);
