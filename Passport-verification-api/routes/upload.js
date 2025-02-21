import express from "express";
import { fileUpload } from "../controllers/docUploadController.js";
import { saveDocumentUpload } from "../controllers/eoController.js";

const router = express.Router();

router.post('/testUpload', fileUpload);
router.post('/eodocumentupload', saveDocumentUpload);

export default router;
