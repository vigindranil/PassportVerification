import express from 'express';
import { saveDocumentUpload , getDocumentUploadDetails} from '../controllers/eoController.js';

const router = express.Router();

/**
 * @swagger
 * /document/upload:
 *   post:
 *     summary: Upload a document
 *     description: Saves document upload details in the database
 *     tags:
 *       - Document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ApplicationId:
 *                 type: integer
 *                 description: ID of the application
 *                 example: 123
 *               DocumentPath:
 *                 type: string
 *                 description: Path of the uploaded document
 *                 example: "/uploads/documents/document1.pdf"
 *               DocumentTypeId:
 *                 type: integer
 *                 description: Type ID of the document
 *                 example: 1
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *       403:
 *         description: User does not have permission to upload documents
 *       400:
 *         description: Invalid input data or failure to upload document
 *       500:
 *         description: Internal server error
 */

router.post('/eodocumentupload', saveDocumentUpload);
router.post('/documentUploadDetailsModel', getDocumentUploadDetails)

export default router;
