import moment from "moment/moment.js";
import { updateDocumentRestoreStatusByDocumentId } from "../models/restoreAndArchiveDocModel.js";
import logger from "../utils/logger.js";
import { S3Client, PutObjectCommand, HeadObjectCommand, RestoreObjectCommand } from "@aws-sdk/client-s3";
import { getDocumentdoneBySP, updateDocumentarchiveStatus } from "../models/cronJobModel.js";
import moment from "moment/moment.js";
import { archiveSPApprovedFileToGlacier } from "./eoController.js";

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
      Key: `docs`, // Unique name for the file
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
      error: error?.message,
    });
  }
};

export const restoreFile = async (req, res) => {
  const { document_id, file_name } = req.body;

  // Initialize S3 Client
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Step 2: Fetch object metadata to get the storage class
  const headData = await s3.send(
    new HeadObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file_name,
    })
  );
  
  const restoreHeader = headData?.Restore;
  const isRestored = restoreHeader?.includes("ongoing-request=\"false\"");

  if(headData?.StorageClass == "GLACIER") {
    if (!restoreHeader){ // restore logic
  
      const restoreParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file_name,
        RestoreRequest: {
          Days: 1,
          GlacierJobParameters: {
            Tier: "Standard", // Expedited(1-5 minutes) | Standard(3-5 hours) | Bulk(5-12 hours)
          },
        },
      };
  
      await s3.send(new RestoreObjectCommand(restoreParams));

      const response = await updateDocumentRestoreStatusByDocumentId(document_id, 11, 0);

      return res.status(200).json({
        status: 0,
        message: "The file will be available in 3-5 hours"
      });
      
    } else {
      if (isRestored) {
        const response = await updateDocumentRestoreStatusByDocumentId(document_id, 0, 1);
        if(response == 0) {
          return res.status(200).json({
            status: 0,
            restored: 1,
            restoreHeader,
            message: "File is successfully restored and temporarily available"
          });
        } else {
          return res.status(200).json({
            status: 1,
            message: "Failed to restore please try again"
          });
        }
      } else {
        return res.status(200).json({
          status: 0,
          onProgress: 1,
          message: "File restore is still in progress."
        });
      }
    }
  }
}

export const archiveDocumentToGlacier = async (req, res) => {
 
  try {
    const { fromDate, toDate } = req.body;
    
    const response = await getDocumentdoneBySP(fromDate, toDate); // this will return a array

    if(response?.length){
      for await (const document of response) {
        const file_key = document?.DocumentPath?.split('https://wb-passport-verify.s3.ap-south-1.amazonaws.com/')[1];
        if(!file_key) continue
        const doc_id = await archiveSPApprovedFileToGlacier(document);
        if(!doc_id) continue
        const response = await updateDocumentarchiveStatus(doc_id);
      }
    }
  } catch (error) {
    console.error("Error executing autoOCApprovallUpdate:", error);
  }
};
