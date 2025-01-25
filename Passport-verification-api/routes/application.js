import express from 'express';
import { getApplicationDetails } from '../controllers/applicationController.js';

const router = express.Router();

/**
 * @swagger
 * /application/details/{applicationId}:
 *   get:
 *     summary: Get application details by application ID
 *     description: Retrieves application details based on the provided application ID and user ID
 *     tags:
 *       - Application Management
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         description: The file number of the application
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application details retrieved successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

router.post('/detailsapplicationId', getApplicationDetails);

export default router;
