import express from "express";

import { fileUploadS3Bucket } from "../controllers/s3UploadController.js";
const router = express.Router();
router.post('/fileUploadS3Bucket', fileUploadS3Bucket);

export default router;