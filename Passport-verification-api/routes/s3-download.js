import express from "express";

import { getPrivateImage, getPrivateImagePassportVerification, getPrivateImagePreview } from "../controllers/s3UploadController.js";
const router = express.Router();
router.post('/getPrivateFile', getPrivateImage);
router.get('/getPrivateFilePreview', getPrivateImagePreview);
router.get('/getPrivateImagePassportVerification', getPrivateImagePassportVerification);

export default router;