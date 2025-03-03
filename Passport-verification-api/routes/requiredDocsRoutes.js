import express from 'express';
import { requiredDocuments } from '../controllers/requiredDocsController.js';

const router = express.Router();


router.post('/get-required-documents', requiredDocuments);
export default router;