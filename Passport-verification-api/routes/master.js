import express from "express";
import { getPoliceStationsByDistrict } from '../controllers/masterController.js';
const router = express.Router();

/**
 * @swagger
 * /master:
 *   post:
 *     summary: master means distric deatils.
 *     description: Distric details list 
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
 *         description: master distric details
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




router.post('/getPoliceStationsByDistrict', getPoliceStationsByDistrict);

export default router;