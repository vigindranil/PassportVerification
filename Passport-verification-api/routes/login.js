import express from "express";
import { sendOtp, sendOtpV1, verifyOtpV1 } from '../controllers/authController.js';
const router = express.Router();



/**
 * @swagger
 * /api/auth/sendOtp:
 *   post:
 *     summary: Send OTP
 *     description: Sends a one-time password (OTP) to the user's Aadhaar-linked mobile number.
 *     tags:
 *       - Authentication & Authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 default: "admin"
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 default: "admin@123"
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.post('/sendOtp', sendOtp);
router.post('/sendOtpV1', sendOtpV1);
router.post('/verifyOtpV1', verifyOtpV1);

export default router;