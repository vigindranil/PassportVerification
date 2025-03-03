import express from "express";
import { fileUpload, fileUploadS3Bucket } from "../controllers/docUploadController.js";
import { saveDocumentUpload } from "../controllers/eoController.js";

const router = express.Router();

router.post('/testUpload', fileUpload);
router.post('/fileUploadS3Bucket', fileUploadS3Bucket);
router.post('/eodocumentupload', saveDocumentUpload);

export default router;
