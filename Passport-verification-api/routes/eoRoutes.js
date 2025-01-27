import express from 'express';
import { saveDocumentUpload , getDocumentUploadDetails,saveCaseAssign} from '../controllers/eoController.js';

const router = express.Router();

router.post('/eodocumentupload', saveDocumentUpload);
router.post('/documentUploadDetailsModel', getDocumentUploadDetails)

export default router;
