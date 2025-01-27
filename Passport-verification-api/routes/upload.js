import express from "express";
import { fileUpload } from "../controllers/docUploadController.js";
import { saveCaseAssign } from "../controllers/eoController.js";

const router = express.Router();

router.post('/testUpload', fileUpload);
router.post('/acceptCaseUploadDocument', saveCaseAssign)

export default router;
