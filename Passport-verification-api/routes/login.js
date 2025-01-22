import express from "express";
import { sendOtp } from '../controllers/authController.js';
const router = express.Router();

// router.post('/sendOtp', sendOtp);


/**
 * @swagger
 * /sendOtp:
 *   post:
 *     summary: Send OTP to user
 *     description: Sends an OTP to the provided email or phone number for authentication.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contact:
 *                 type: string
 *                 description: Email or phone number to send the OTP to.
 *                 example: example@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid input.
 */
router.post('/sendOtp', sendOtp);


export default router;