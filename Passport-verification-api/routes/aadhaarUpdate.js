import express from 'express';
import { getUserAADHARInfo, getApplicantAADHARInfo } from '../controllers/aadhaarUpdateController.js';

const router = express.Router();
router.post('/getUserAADHARInfo', getUserAADHARInfo);
router.post('/getApplicantAADHARInfo', getApplicantAADHARInfo);
export default router;
