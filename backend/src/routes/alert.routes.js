import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getAlerts,
  createAlert,
  resolveAlert,
  deleteAlert,
  getAlertStats
} from "../controller/alert.controller.js";

const router = Router();

router.get("/", protect, getAlerts);
router.get("/stats", protect, getAlertStats);
router.post("/", protect, createAlert);
router.patch("/:id/resolve", protect, resolveAlert);
router.delete("/:id", protect, deleteAlert);

export default router;