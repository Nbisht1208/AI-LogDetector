import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  fileId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date,  },
  severity: { type: String,  },  
  ip: { type: String,  },
  user: { type: String },
  endpoint: { type: String,  },
  message: String,
  rawLine: String
}, { timestamps: true });

LogSchema.index({ timestamp: 1 });
LogSchema.index({ severity: 1 });
LogSchema.index({ ip: 1 });
LogSchema.index({ endpoint: 1 });

export default mongoose.model("Log", LogSchema);
