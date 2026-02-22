import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import helmet from "helmet";
const app = express();
app.use(helmet());
connectDB();
app.use(cors({
  origin: "http://localhost:5173", // Vite
  credentials: true
}));

app.use(express.json());
const PORT = process.env.PORT || 5000;
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes);
import logRoutes from "./routes/log.routes.js";
app.use("/api/v1/logs", logRoutes);
import logStorageRoutes from "./routes/logStorage.routes.js";
app.use("/api/v1/logs", logStorageRoutes);
import alertRoutes from "./routes/alert.routes.js";
app.use("/api/v1/alerts", alertRoutes);
import statsRoutes from "./routes/stats.routes.js";
app.use("/api/v1/stats", statsRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}


export default app;
