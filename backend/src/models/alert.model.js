import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "LogFile" },
  ip: { type: String },
  severity: { type: String, enum: ["Low", "Medium", "High", "Critical"] },
  threatType: { type: String },
  message: { type: String },
  explanation: { type: String },
  recommendedAction: { type: String },
  isResolved: { type: Boolean, default: false },
  resolvedAt: { type: Date }
}, { timestamps: true });

AlertSchema.index({ severity: 1 });
AlertSchema.index({ isResolved: 1 });
AlertSchema.index({ createdAt: -1 });

export default mongoose.model("Alert", AlertSchema);