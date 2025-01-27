import express from "express";
import { fileUpload } from "../controllers/docUploadController.js";

const router = express.Router();

router.post('/testUpload', fileUpload);

export default router;
