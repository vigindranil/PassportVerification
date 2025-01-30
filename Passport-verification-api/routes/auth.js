import express from 'express';
import { verifyOtp } from '../controllers/authController.js';
const router = express.Router();

/**
 * @swagger
 * /api/auth/verifyOtp:
 *   post:
 *     summary: Verify OTP
 *     description: Verifies the one-time password (OTP) sent to the user's Aadhaar-linked mobile number.
 *     tags:
 *       - Authentication & Authorization
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The OTP sent to the user.
 *                 default: "999999"
 *             required:
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       400:
 *         description: Bad request (Invalid OTP).
 *       500:
 *         description: Internal server error.
 */
router.post('/verifyOtp', verifyOtp);

export default router;