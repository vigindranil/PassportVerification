import express from "express";
import {saveUserRegistration, updateUserActivationStatus ,getDistrictNodalDashBoard,showuserDetails, getApplicationStatus} from '../controllers/userController.js';

/**
 * @swagger
 * /user:
 *   post:
 *     summary: All users .
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



const router = express.Router();
router.post('/saveUser', saveUserRegistration);
router.post('/updateUser', updateUserActivationStatus);
router.post('/getDistrictNodalDashBoard', getDistrictNodalDashBoard);
router.post('/showuserDetails', showuserDetails);
router.post('/getApplicationStatus', getApplicationStatus);
export default router;