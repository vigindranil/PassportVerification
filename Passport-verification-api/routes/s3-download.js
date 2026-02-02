import express from "express";

import { getPrivateImage, getPrivateImagePassportVerification, getPrivateImagePreview, getPrivateImagePreviewOld } from "../controllers/s3UploadController.js";
const router = express.Router();
router.post('/getPrivateFile', getPrivateImage);
router.get('/getPrivateFilePreview', getPrivateImagePreview);
router.get('/getPrivateFilePreviewOld', getPrivateImagePreviewOld);
router.get('/getPrivateImagePassportVerification', getPrivateImagePassportVerification);

export default router;