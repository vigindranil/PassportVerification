import express from "express";

import { getPrivateImage, getPrivateImagePassportVerification } from "../controllers/s3UploadController.js";
const router = express.Router();
router.post('/getPrivateFile', getPrivateImage);
router.get('/getPrivateImagePassportVerification', getPrivateImagePassportVerification);

export default router;