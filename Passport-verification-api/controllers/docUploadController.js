import logger from "../utils/logger.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

export const fileUploadS3Bucket = async (req, res) => {
  try {

    // Initialize S3 Client
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Check if the S3 bucket exists
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `file_name_pattern`, // Unique name for the file
      Body: req.file.buffer,
      ContentType: req.file.mimetype || "application/octet-stream", // Set content type dynamically
      ACL: "public-read", // This allows the file to be publicly readable
    };
    try {
      await s3.send(new PutObjectCommand(params));
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw new Error("Failed to upload file to S3");
    }

    return res.status(200).json({
      status: 0,
      message: "Document uploaded successfully",
      fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
    });
  } catch (error) {
    console.error("Error saving document upload:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while saving document upload",
      error: error.message,
    });
  }
};
