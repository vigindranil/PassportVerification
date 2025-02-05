import express from 'express';
import { saveDocumentUpload , getDocumentUploadDetails, getStatusByEO} from '../controllers/eoController.js';

const router = express.Router();

router.post('/documentUploadDetailsModel', getDocumentUploadDetails)
router.post('/getStatusByEO', getStatusByEO)

export default router;
