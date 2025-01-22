// import express from "express";
// import { verifyOtp } from '../controllers/authController.js';
// const router = express.Router();

// router.post('/verifyOtp', verifyOtp);

// export default router;

import express from 'express';
import { verifyOtp } from '../controllers/authController.js';
const router = express.Router();

/**
 * @swagger
 * /verifyOtp:
 *   post:
 *     summary: Verify OTP
 *     description: Endpoint to verify a one-time password (OTP).
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
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number associated with the OTP.
 *             required:
 *               - otp
 *               - phoneNumber
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully."
 *       400:
 *         description: Invalid OTP or phone number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid OTP or phone number."
 */
router.post('/verifyOtp', verifyOtp);

export default router;