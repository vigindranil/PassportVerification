import express from "express";
import { verifyOtp } from '../controllers/authController.js';
const router = express.Router();

router.post('/verifyOtp', verifyOtp);

export default router;