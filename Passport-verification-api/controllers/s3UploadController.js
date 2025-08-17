import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
  RestoreObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import zlib from "zlib";

export const fileUploadS3Bucket = async (req, res) => {
  try {
    const {
      FILE_NAME,
      AWS_REGION,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_BUCKET_NAME,
      STORAGE_CLASS = "INTELLIGENT_TIERING" || "STANDARD_IA" || "STANDARD" || "DEEP_ARCHIVE" || "GLACIER",
    } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: 1,
        message: "No file found in request",
      });
    }

    
    // Compress the file buffer using gzip
    const compressedBuffer = zlib.gzipSync(req.file.buffer);
    const decompressedBuffer = zlib.gunzipSync(compressedBuffer);

    // 4. HASH: SHA-256 of decompressed file
    const fileHash = crypto.createHash("sha256").update(decompressedBuffer).digest("hex");

    // Initialize S3 Client
    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `${FILE_NAME}`, // Optional: add .gz extension
      Body: compressedBuffer,
      ContentType: req.file.mimetype || "application/octet-stream",
      ContentEncoding: "gzip", // Important to mark it as compressed
      StorageClass: STORAGE_CLASS, // "INTELLIGENT_TIERING" || "STANDARD_IA" || "STANDARD" || "DEEP_ARCHIVE" || "GLACIER".
      // ACL: "public-read",
      ServerSideEncryption: "AES256",
    };

    try {
      await s3.send(new PutObjectCommand(params));
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw new Error("Failed to upload file to S3");
    }

    return res.status(200).json({
      status: 0,
      message: "Compressed document uploaded successfully",
      fileUrl: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
      fileHash
    });
  } catch (error) {
    console.error("Error saving compressed document:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while saving compressed document",
      error: error.message,
    });
  }
};

export const archiveFileToGlacier = async (req, res) => {
  try {
    const {
      FILE_KEY,
      AWS_REGION,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_BUCKET_NAME,
      STORAGE_CLASS = "GLACIER",
    } = req.body;

    if (!FILE_KEY || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_BUCKET_NAME) {
      return res.status(400).json({ status: 1, message: "Missing required parameters" });
    }

    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const copyCommand = new CopyObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: FILE_KEY,
      CopySource: `/${AWS_BUCKET_NAME}/${FILE_KEY}`,
      StorageClass: STORAGE_CLASS,
      MetadataDirective: "COPY",
    });

    await s3.send(copyCommand);

    return res.status(200).json({
      status: 0,
      message: `File successfully archived to ${STORAGE_CLASS}`,
      fileKey: FILE_KEY,
    });

  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: "Failed to archive file to Glacier",
      error: error.message,
    });
  }
};

export const restoreFileFromGlacier = async (req, res) => {
  try {
    const {
      FILE_KEY,
      AWS_REGION,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_BUCKET_NAME,
      DAYS = 1, // Number of days to keep the file in restored state
      TIER = "Standard", // Options: Expedited(1-5 minutes) | Standard(3-5 hours) | Bulk(5-12 hours)
    } = req.body;

    if (!FILE_KEY || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_BUCKET_NAME) {
      return res.status(400).json({ status: 1, message: "Missing required parameters" });
    }

    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const restoreParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: FILE_KEY,
      RestoreRequest: {
        Days: DAYS,
        GlacierJobParameters: {
          Tier: TIER, // Expedited(1-5 minutes) | Standard(3-5 hours) | Bulk(5-12 hours)
        },
      },
    };

    await s3.send(new RestoreObjectCommand(restoreParams));

    return res.status(200).json({
      status: 0,
      message: `The file will be available in ${TIER === "Expedited" ? "1-5 minutes" : TIER === "Standard" ? "3-5 hours" : "5-12 hours"}`,
      fileKey: FILE_KEY,
    });

  } catch (error) {
    console.error("Restore error:", error);
    return res.status(500).json({
      status: 1,
      message: "Failed to initiate restore from Glacier",
      error: error.message,
    });
  }
};

export const checkFileRestoreStatus = async (req, res) => {
  try {
    const {
      FILE_KEY,
      AWS_REGION,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_BUCKET_NAME,
    } = req.body;

    if (!FILE_KEY || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_BUCKET_NAME) {
      return res.status(400).json({ status: 1, message: "Missing required parameters" });
    }

    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new HeadObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: FILE_KEY,
    });

    const response = await s3.send(command);

    // Check x-amz-restore metadata
    const restoreHeader = response?.Restore;

    if (!restoreHeader) {
      return res.status(200).json({
        status: 0,
        message: "File is not archived or restore was never initiated.",
        restored: true, // not in Glacier
      });
    }

    const isRestored = restoreHeader.includes("ongoing-request=\"false\"");

    return res.status(200).json({
      status: 0,
      message: isRestored
        ? "File is successfully restored and temporarily available."
        : "File restore is still in progress.",
      restored: isRestored,
      restoreHeader,
    });

  } catch (error) {
    console.error("Error checking restore status:", error);
    return res.status(500).json({
      status: 1,
      message: "Failed to check file restore status",
      error: error.message,
    });
  }
};

export const getPrivateImage = async (req, res) => {
  try {
    const {
      FILE_KEY,
      AWS_REGION,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_BUCKET_NAME,
    } = req.body;

    if (!FILE_KEY || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_BUCKET_NAME) {
      return res.status(400).json({ status: 1, message: "Missing required parameters" });
    }

    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    // 1. HEAD: Check if archived or still restoring
    const headData = await s3Client.send(new HeadObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: FILE_KEY,
    }));

    const restoreHeader = headData?.Restore;
    const storageClass = headData?.StorageClass;

    if (storageClass?.includes("GLACIER") || storageClass === "DEEP_ARCHIVE") {
      if (!restoreHeader) {
        return res.status(423).json({
          status: 1,
          message: "File is archived in Glacier. Restore request not initiated.",
        });
      }

      if (restoreHeader.includes('ongoing-request="true"')) {
        return res.status(425).json({
          status: 1,
          message: "File restore is still in progress. Please wait.",
        });
      }
    }

    // 2. GET: Fetch the object
    const getCommand = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: FILE_KEY,
    });

    const { Body: compressedStream } = await s3Client.send(getCommand);

    // 3. DECOMPRESS: Gzip → Original
    const decompressedStream = compressedStream.pipe(zlib.createGunzip());

    // 4. HASH: SHA-256 of decompressed file
    const fileHash = await new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256");
      decompressedStream.on("data", (chunk) => hash.update(chunk));
      decompressedStream.on("end", () => resolve(hash.digest("hex")));
      decompressedStream.on("error", reject);
    });

    // 5. SIGNED URL (original stream is gzip, client needs to decompress)
    const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 30 });

    return res.status(200).json({
      status: 0,
      message: "Signed URL generated. File is Gzip compressed.",
      tempSignedUrl: signedUrl,
      sha256: fileHash,
      compressed: true,
    });

  } catch (error) {
    console.error("Error in getPrivateImage:", error);

    if (error.name === "NoSuchKey") {
      return res.status(404).json({ status: 1, message: "File not found" });
    }

    if (error.Code === "InvalidObjectState") {
      return res.status(423).json({ status: 1, message: "File is archived and not restored yet." });
    }

    return res.status(500).json({
      status: 1,
      message: "An error occurred while processing the request",
      error: error.message,
    });
  }
};

export const getPrivateImagePassportVerification = async (req, res) => {
  try {
    const { FILE_KEY } = req.query;

    if (!FILE_KEY) {
      return res
        .status(400)
        .json({ status: 1, message: "Missing required parameters" });
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
    if (error.code === "NoSuchKey") {
      return res.status(500).json({
        status: 1,
        message: "File not found",
        error: error.message,
      });
    }
    if (error.code === "InvalidObjectState") {
      return res.status(500).json({
        status: 1,
        message: "File is archived in Glacier. Please restore it first.",
        error: error.message,
      });
    }
    return res.status(500).json({
      status: 1,
      message: "An error occurred while generating the signed URL",
      error: error.message,
    });
  }
};

export const changeStorageClassToStandardIA = async (req, res) => {
  // AWS Config
  const {
    FILE_KEY,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME,
  } = req.body;

  try {
    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    // Copy object to itself with new storage class
    const copyCommand = new CopyObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: FILE_KEY,
      CopySource: `${AWS_BUCKET_NAME}/${FILE_KEY}`, // no leading slash
      StorageClass: "INTELLIGENT_TIERING",
      MetadataDirective: "COPY",
    });

    await s3.send(copyCommand);

    return res.status(200).json({
      status: 0,
      message: "Storage class updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: "An error occurred while processing the request",
      error: error.message,
    });
  }
};

export const checkStorageClass = async (req, res) => {
  const {
    FILE_KEY,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME,
  } = req.body;

  try {
    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    // Step 2: Fetch object metadata to get the storage class
    const headData = await s3.send(
      new HeadObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: FILE_KEY,
      })
    );

    return res.status(200).json({
      storageClass: headData.StorageClass || "STANDARD",
    });
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: "An error occurred while processing the request",
      error: error.message,
    });
  }
};
