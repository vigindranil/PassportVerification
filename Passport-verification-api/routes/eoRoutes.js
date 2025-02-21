import express from 'express';
import { saveDocumentUpload , getDocumentUploadDetails, getStatusByEO, getCountEO} from '../controllers/eoController.js';

const router = express.Router();

router.post('/documentUploadDetailsModel', getDocumentUploadDetails)
router.post('/getStatusByEO', getStatusByEO)
router.post('/getCountEO', getCountEO)
export default router;
