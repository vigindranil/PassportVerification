import express from 'express';
import { getUserAADHARInfo } from '../controllers/aadhaarUpdateController.js';

const router = express.Router();
router.post('/getUserAADHARInfo', getUserAADHARInfo);
export default router;
