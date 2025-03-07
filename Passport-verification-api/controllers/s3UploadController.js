import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const fileUploadS3Bucket = async (req, res) => {
  try {
    const { FILE_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = req.body;

    // Initialize S3 Client
    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    // Check if the S3 bucket exists
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: FILE_NAME, // Unique name for the file
      Body: req.file.buffer,
      ContentType: req.file.mimetype || "application/octet-stream", // Set content type dynamically
      // ACL: "public-read", // This allows the file to be publicly readable
    };
    try {
      await s3.send(new PutObjectCommand(params));
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw new Error("Failed to upload file to S3");
    }

    console.log("\x1b[32m%s\x1b[0m", "document upload complete!");
    return res.status(200).json({
      status: 0,
      message: "Document uploaded successfully",
      fileUrl: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
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

export const getPrivateImage = async (req, res) => {
  try {
    const { FILE_KEY, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = req.body;

    if (!FILE_KEY || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_BUCKET_NAME) {
      return res.status(400).json({ status: 1, message: "Missing required parameters" });
    }

    // Initialize S3 Client with received credentials
    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    // Create a command for fetching the object
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: FILE_KEY,
    });

    // Generate a signed URL with a short expiration (e.g., 30 seconds)
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 30 });

    return res.status(200).json({
      status: 0,
      message: "One-time signed URL generated successfully",
      tempSignedUrl: signedUrl, // The URL will expire after first use or 30 seconds
    });

  } catch (error) {
    console.error("Error generating signed URL:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while generating the signed URL",
      error: error.message,
    });
  }
};

export const getPrivateImagePassportVerification = async (req, res) => {
  try {
    const { FILE_KEY } = req.query;

    if (!FILE_KEY) {
      return res.status(400).json({ status: 1, message: "Missing required parameters" });
    }
    
    // Initialize S3 Client with received credentials
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Create a command for fetching the object
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: FILE_KEY,
    });

    // Generate a signed URL with a short expiration (e.g., 30 seconds)
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 30 });

    return res.status(200).json({
      status: 0,
      message: "One-time signed URL generated successfully",
      tempSignedUrl: signedUrl, // The URL will expire after first use or 30 seconds
    });

  } catch (error) {
    console.error("Error generating signed URL:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while generating the signed URL",
      error: error.message,
    });
  }
};

