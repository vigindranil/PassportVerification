import express from "express";
import {convertExcelToJson, uploadExcel} from '../controllers/fileImportController.js';

const router = express.Router();

router.post('/convertExcelToJson', convertExcelToJson);
router.post('/uploadExcel', uploadExcel);

export default router;
