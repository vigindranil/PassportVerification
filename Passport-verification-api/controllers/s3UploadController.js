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
import sharp from "sharp";

export const fileUploadS3Bucket = async (req, res) => {
  try {
    const {
      FILE_NAME,
      AWS_REGION,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_BUCKET_NAME,
      STORAGE_CLASS = "INTELLIGENT_TIERING",
    } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: 1,
        message: "No file found in request",
      });
    }

    let outputBuffer = req.file.buffer;
    let contentType = req.file.mimetype;

    /* ================= IMAGE SUPER COMPRESSION ================= */
    if (contentType.startsWith("image/")) {
      outputBuffer = await sharp(req.file.buffer)
        .resize({
          width: 1600,        // 🔥 reduce resolution (optional)
          withoutEnlargement: true,
        })
        .webp({
          quality: 45,        // 🔥 VERY strong compression
          effort: 6,
        })
        .toBuffer();

      contentType = "image/webp";
    }

    /* ================= FILE HASH ================= */
    const fileHash = crypto
      .createHash("sha256")
      .update(outputBuffer)
      .digest("hex");

    /* ================= S3 UPLOAD ================= */
    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const keyName = contentType === "image/webp"
      ? FILE_NAME.replace(/\.[^/.]+$/, ".webp")
      : FILE_NAME;

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: keyName,
      Body: outputBuffer,
      ContentType: contentType,
      StorageClass: STORAGE_CLASS,
      ServerSideEncryption: "AES256",
    };

    await s3.send(new PutObjectCommand(params));

    return res.status(200).json({
      status: 0,
      message: "Image uploaded with super compression",
      fileUrl: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${keyName}`,
      fileHash,
      originalSizeKB: (req.file.size / 1024).toFixed(2),
      compressedSizeKB: (outputBuffer.length / 1024).toFixed(2),
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      status: 1,
      message: "Failed to upload compressed image",
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
      return res.status(400).json({
        status: 1,
        message: "Missing required parameters",
      });
    }

    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    /* ================= HEAD: ARCHIVE CHECK ================= */
    const headData = await s3Client.send(
      new HeadObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: FILE_KEY,
      })
    );

    const restoreHeader = headData?.Restore;
    const storageClass = headData?.StorageClass;

    if (storageClass?.includes("GLACIER") || storageClass === "DEEP_ARCHIVE") {
      if (!restoreHeader) {
        return res.status(423).json({
          status: 1,
          message: "File is archived in Glacier. Restore not initiated.",
        });
      }

      if (restoreHeader.includes('ongoing-request="true"')) {
        return res.status(425).json({
          status: 1,
          message: "File restore is in progress.",
        });
      }
    }

    /* ================= GET OBJECT ================= */
    const getCommand = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: FILE_KEY,
    });

    const { Body: fileStream, ContentType } = await s3Client.send(getCommand);

    /* ================= HASH (SHA-256) ================= */
    const fileHash = await new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256");
      fileStream.on("data", (chunk) => hash.update(chunk));
      fileStream.on("end", () => resolve(hash.digest("hex")));
      fileStream.on("error", reject);
    });

    /* ================= SIGNED URL ================= */
    const signedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 60, // seconds
    });

    return res.status(200).json({
      status: 0,
      message: "Signed URL generated successfully",
      tempSignedUrl: signedUrl,
      sha256: fileHash,
      contentType: ContentType || "image/webp",
      compressed: true,
      compressionType: "sharp-webp",
    });

  } catch (error) {
    console.error("Error in getPrivateImage:", error);

    if (error.name === "NoSuchKey") {
      return res.status(404).json({
        status: 1,
        message: "File not found",
      });
    }

    if (error.Code === "InvalidObjectState") {
      return res.status(423).json({
        status: 1,
        message: "File is archived and not restored yet.",
      });
    }

    return res.status(500).json({
      status: 1,
      message: "Failed to fetch private image",
      error: error.message,
    });
  }
};


export const getPrivateImagePreviewOld = async (req, res) => {
  try {
    const { FILE_KEY } = req.query;

    if (!FILE_KEY ) {
      return res.status(400).json({
        status: 1,
        message: "Missing required parameters",
      });
    }

    const s3Client = new S3Client({
      region: process.env.AWS_REGION_OLD,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_OLD,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_OLD,
      },
    });

    /* ================= HEAD: ARCHIVE CHECK ================= */
    const headData = await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME_OLD,
        Key: FILE_KEY,
      })
    );

    const restoreHeader = headData?.Restore;
    const storageClass = headData?.StorageClass;

    if (storageClass?.includes("GLACIER") || storageClass === "DEEP_ARCHIVE") {
      if (!restoreHeader) {
        return res.status(423).json({
          status: 1,
          message: "File is archived in Glacier. Restore not initiated.",
        });
      }

      if (restoreHeader.includes('ongoing-request="true"')) {
        return res.status(425).json({
          status: 1,
          message: "File restore is in progress.",
        });
      }
    }

    /* ================= GET OBJECT ================= */
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME_OLD,
      Key: FILE_KEY,
    });

    const { Body: fileStream, ContentType } = await s3Client.send(getCommand);

    /* ================= HASH (SHA-256) ================= */
    const fileHash = await new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256");
      fileStream.on("data", (chunk) => hash.update(chunk));
      fileStream.on("end", () => resolve(hash.digest("hex")));
      fileStream.on("error", reject);
    });

    /* ================= SIGNED URL ================= */
    const signedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 60, // seconds
    });

    return res.status(200).json({
      status: 0,
      message: "Signed URL generated successfully",
      tempSignedUrl: signedUrl,
      sha256: fileHash,
      contentType: ContentType || "image/webp",
      compressed: true,
      compressionType: "sharp-webp",
    });

  } catch (error) {
    console.error("Error in getPrivateImage:", error);

    if (error.name === "NoSuchKey") {
      return res.status(404).json({
        status: 1,
        message: "File not found",
      });
    }

    if (error.Code === "InvalidObjectState") {
      return res.status(423).json({
        status: 1,
        message: "File is archived and not restored yet.",
      });
    }

    return res.status(500).json({
      status: 1,
      message: "Failed to fetch private image",
      error: error.message,
    });
  }
};



export const getPrivateImagePreview = async (req, res) => {
  try {
    const { FILE_KEY } = req.query;


    if (!FILE_KEY) {
      return res.status(400).json({
        status: 1,
        message: "Missing required parameters",
      });
    }

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    /* ================= HEAD: ARCHIVE CHECK ================= */
    const headData = await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: FILE_KEY,
      })
    );

    const restoreHeader = headData?.Restore;
    const storageClass = headData?.StorageClass;

    if (storageClass?.includes("GLACIER") || storageClass === "DEEP_ARCHIVE") {
      if (!restoreHeader) {
        return res.status(423).json({
          status: 1,
          message: "File is archived in Glacier. Restore not initiated.",
        });
      }

      if (restoreHeader.includes('ongoing-request="true"')) {
        return res.status(425).json({
          status: 1,
          message: "File restore is in progress.",
        });
      }
    }

    /* ================= GET OBJECT ================= */
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: FILE_KEY,
    });

    const { Body: fileStream, ContentType } = await s3Client.send(getCommand);

    /* ================= HASH (SHA-256) ================= */
    const fileHash = await new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256");
      fileStream.on("data", (chunk) => hash.update(chunk));
      fileStream.on("end", () => resolve(hash.digest("hex")));
      fileStream.on("error", reject);
    });

    /* ================= SIGNED URL ================= */
    const signedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 60, // seconds
    });

    return res.status(200).json({
      status: 0,
      message: "Signed URL generated successfully",
      tempSignedUrl: signedUrl,
      sha256: fileHash,
      contentType: ContentType || "image/webp",
      compressed: true,
      compressionType: "sharp-webp",
    });

  } catch (error) {
    console.error("Error in getPrivateImage:", error);

    if (error.name === "NoSuchKey") {
      return res.status(404).json({
        status: 1,
        message: "File not found",
      });
    }

    if (error.Code === "InvalidObjectState") {
      return res.status(423).json({
        status: 1,
        message: "File is archived and not restored yet.",
      });
    }

    return res.status(500).json({
      status: 1,
      message: "Failed to fetch private image",
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
