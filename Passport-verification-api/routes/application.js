import express from 'express';
import { getApplicationDetails ,getDocumentsApplicationDetailsByFileNo,updateEnquiryStatus, verifyApplication, getAadharDetailsByapplicationId , updateAADHAARInfo, updateAADHAARInfoV2,getApplicationCountMasterAdmin, getApplicationCountMasterAdminV1} from '../controllers/applicationController.js';
import { saveCaseAssign } from '../controllers/eoController.js';

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
router.post('/updateEnquiryStatus', updateEnquiryStatus);
router.post('/acceptCaseUploadDocument', saveCaseAssign)
router.post('/verifyApplication', verifyApplication);
router.post('/getDocumentsApplicationDetailsByFileNo', getDocumentsApplicationDetailsByFileNo);
router.post('/getAadharDetailsByapplicationId', getAadharDetailsByapplicationId);
router.post('/updateAADHAARInfo', updateAADHAARInfo);
router.post('/updateAADHAARInfoV2', updateAADHAARInfoV2);
router.post('/getApplicationCountMasterAdmin', getApplicationCountMasterAdmin);
router.post('/getApplicationCountMasterAdminV1', getApplicationCountMasterAdminV1);
export default router;
