import express from "express";
import { generateSecretToken, sendOtp, sendOtpV1, verifyOtpV1 } from '../controllers/authController.js';
const router = express.Router();

router.post('/sendOtp', sendOtp);
router.post('/sendOtpV1', sendOtpV1);
router.post('/verifyOtpV1', verifyOtpV1);
router.post('/generateSecretToken', generateSecretToken);

export default router;