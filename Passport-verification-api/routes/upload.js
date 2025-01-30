import express from "express";
import { fileUpload } from "../controllers/docUploadController.js";
import { saveCaseAssign, saveDocumentUpload } from "../controllers/eoController.js";

const router = express.Router();

router.post('/testUpload', fileUpload);
router.post('/acceptCaseUploadDocument', saveCaseAssign)
router.post('/eodocumentupload', saveDocumentUpload);

export default router;
