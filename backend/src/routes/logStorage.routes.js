import { Router } from "express";
import {
  getLogs,
  getLogById,
  searchLogs,
  deleteLog,
  bulkDeleteLogs
} from "../controller/logStorage.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, getLogs);
router.get("/search", protect, searchLogs);
router.get("/:id", protect, getLogById);
router.delete("/:id", protect, deleteLog);
router.delete("/", protect, bulkDeleteLogs);

export default router;
