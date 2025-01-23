import express from "express";
import { sendOtp } from '../controllers/authController.js';
const router = express.Router();




router.post('/sendOtp', sendOtp);

export default router;