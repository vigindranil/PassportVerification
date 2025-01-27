import express from "express";
import { getPoliceStationsByDistrict, showDistrict, showDesignation , getDocumentsByCitizenType, getCitizenTypes, getDocumentSubTypes, getDocumentTypeList} from '../controllers/masterController.js';

const router = express.Router();

/**
 * @swagger
 * /master/getPoliceStationsByDistrict:
 *   post:
 *     summary: Fetch police stations by district ID
 *     description: Retrieves a list of police stations for a given district ID
 *     tags:
 *       - District
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtId:
 *                 type: integer
 *                 description: The ID of the district
 *                 example: 1
 *     responses:
 *       200:
 *         description: Police stations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Police stations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Invalid districtId
 */

/**
 * @swagger
 * /master/showDistrict:
 *   get:
 *     summary: Fetch all districts
 *     description: Retrieves a list of all districts
 *     tags:
 *       - District
 *     responses:
 *       200:
 *         description: Districts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Districts fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching districts
 */

router.post('/getPoliceStationsByDistrict', getPoliceStationsByDistrict);
router.post('/showDistrict', showDistrict);
router.post('/showDesignation', showDesignation);
router.post('/getDocumentsByCitizenType',getDocumentsByCitizenType)
router.post('/getCitizenTypes',getCitizenTypes)
router.post('/getDocumentSubTypesByID',getDocumentSubTypes)
router.post('/getDocumentTypeList',getDocumentTypeList)
export default router;
