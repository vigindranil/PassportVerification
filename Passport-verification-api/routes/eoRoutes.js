import express from 'express';
import { saveDocumentUpload , getDocumentUploadDetails} from '../controllers/eoController.js';

const router = express.Router();

router.post('/documentUploadDetailsModel', getDocumentUploadDetails)

export default router;
