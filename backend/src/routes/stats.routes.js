import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getLogsByIP,
  getSeverityStats,
  getTimeSeries,
  getDashboardStats
} from "../controller/stats.controller.js";

const router = Router();

router.get("/dashboard", protect, getDashboardStats);
router.get("/by-ip", protect, getLogsByIP);
router.get("/severity", protect, getSeverityStats);
router.get("/timeseries", protect, getTimeSeries);

export default router;