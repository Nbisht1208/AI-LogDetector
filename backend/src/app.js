import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

const app = express();
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

app.listen(PORT, () => console.log(`Server running on ${PORT}`));


export default app;
