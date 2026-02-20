import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadLog, parseLog, getFileStatus, analyzeLogs } from "../controller/log.controller.js";

const router = Router();

router.post("/upload", protect, upload.single("file"), uploadLog);
router.post("/parse/:fileId", protect, parseLog);
router.get("/file-status/:fileId", protect, getFileStatus);
router.post("/analyze/:fileId", protect, analyzeLogs);



export default router;
