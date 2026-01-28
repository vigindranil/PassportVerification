import express from "express";
import { convertExcelToJson, convertExcelToJsonV2, uploadExcel } from '../controllers/fileImportController.js';

const router = express.Router();

router.post('/convertExcelToJson', convertExcelToJson);
router.post('/convertExcelToJsonV2', convertExcelToJsonV2);
router.post('/uploadExcel', uploadExcel);

export default router;
