import { getPoliceStationsByDistrictModel } from '../models/masterModels.js';
import { showDistrictModel } from '../models/masterModels.js';

/**
 * @swagger
 * /getPoliceStationsByDistrict:
 *   post:
 *     summary: Get Police Stations by District
 *     description: Fetches a list of police stations based on the provided district ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtId:
 *                 type: number
 *                 description: The ID of the district to fetch police stations for.
 *             required:
 *               - districtId
 *     responses:
 *       200:
 *         description: Police stations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Police stations fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       stationId:
 *                         type: number
 *                         example: 101
 *                       stationName:
 *                         type: string
 *                         example: "Central Police Station"
 *       400:
 *         description: Bad request (Invalid districtId).
 *       404:
 *         description: No police stations found for the given districtId.
 *       500:
 *         description: Internal server error.
 */
export const getPoliceStationsByDistrict = async (req, res) => {
  try {
    const { districtId } = req.body;

    if (!districtId || isNaN(districtId)) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid districtId',
      });
    }

    const result = await getPoliceStationsByDistrictModel(districtId);

    if (result.length > 0) {
      return res.status(200).json({
        status: 0,
        message: 'Police stations fetched successfully',
        data: result,
      });
    } else {
      return res.status(404).json({
        status: 1,
        message: 'No police stations found for the given districtId',
      });
    }
  } catch (error) {
    console.error('Error fetching police stations:', error);
    return res.status(500).json({
      status: 1,
      message: 'An error occurred while fetching police stations',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /showDistrict:
 *   get:
 *     summary: Show Districts
 *     description: Fetches a list of all districts.
 *     responses:
 *       200:
 *         description: Districts fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Districts fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       districtId:
 *                         type: number
 *                         example: 1
 *                       districtName:
 *                         type: string
 *                         example: "District A"
 *       404:
 *         description: No districts found.
 *       500:
 *         description: Internal server error.
 */
export const showDistrict = async (req, res) => {
  try {
    const result = await showDistrictModel();

    if (result.length > 0) {
      return res.status(200).json({
        status: 0,
        message: 'Districts fetched successfully',
        data: result,
      });
    } else {
      return res.status(404).json({
        status: 1,
        message: 'No districts found',
      });
    }
  } catch (error) {
    console.error('Error fetching districts:', error);
    return res.status(500).json({
      status: 1,
      message: 'An error occurred while fetching districts',
      error: error.message,
    });
  }
};
