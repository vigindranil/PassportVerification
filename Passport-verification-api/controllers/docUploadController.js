import logger from "../utils/logger.js";

/**
 * @swagger
 * /testUpload:
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
 */
export const fileUpload = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ status: 1, message: "No file uploaded" });
    }

    logger.debug(
      JSON.stringify({
        API: "fileUpload",
        REQUEST: file,
        RESPONSE: {
          status: 0,
          message: `File uploaded successfully`,
          data: {
            file_path: req?.filePath,
            file_name: req?.file?.originalname,
          },
        },
      })
    );
    res.status(200).json({
      status: 0,
      message: `File uploaded successfully`,
      data: {
        file_path: req?.filePath,
        file_name: req?.file?.originalname,
      },
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ status: 1, message: "Faild to upload file" });
  }
};
