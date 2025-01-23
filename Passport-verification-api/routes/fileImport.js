import express from "express";
import {convertExcelToJson} from '../controllers/fileImportController.js';

const router = express.Router();

router.post('/importExcel', convertExcelToJson);

export default router;
