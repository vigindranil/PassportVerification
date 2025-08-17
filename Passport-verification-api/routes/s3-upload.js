import express from "express";

import { archiveFileToGlacier, fileUploadS3Bucket, restoreFileFromGlacier, checkFileRestoreStatus, changeStorageClassToStandardIA, checkStorageClass } from "../controllers/s3UploadController.js";
import { restoreFile } from "../controllers/docUploadController.js";
const router = express.Router();
router.post('/fileUploadS3Bucket', fileUploadS3Bucket);
router.post('/archiveFileToGlacier', archiveFileToGlacier);
router.post('/restoreFileFromGlacier', restoreFileFromGlacier);
router.post('/checkFileRestoreStatus', checkFileRestoreStatus);
router.post('/changeStorageClassToStandardIA', changeStorageClassToStandardIA);
router.post('/checkStorageClass', checkStorageClass);
router.post('/restoreFile', restoreFile)

export default router;