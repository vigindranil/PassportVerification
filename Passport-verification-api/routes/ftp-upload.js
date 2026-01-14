import express from "express";
import UploadController from "../controllers/uploadController.js";

const router = express.Router();
router.post("/upload-doc-ftp", UploadController.uploadFile);

export default router;