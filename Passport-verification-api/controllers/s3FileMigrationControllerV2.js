import {
    S3Client,
    HeadObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    ListObjectsV2Command,
    CopyObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import zlib from "zlib";

export async function migrateGzipImagesByKeys(keys = []) {
    const AWS_REGION = process.env.AWS_REGION;
    const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

    const s3 = new S3Client({
        region: AWS_REGION, credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    });

    const streamToBuffer = async (stream) => {
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return Buffer.concat(chunks);
    };

    let processed = 0;

    for (const key of keys) {
        try {
            // 🔹 HEAD — ONLY CHECK METADATA
            const head = await s3.send(
                new HeadObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    Key: key,
                })
            );

            // 🔹 PROCEED ONLY IF GZIP
            if (head.ContentEncoding !== "gzip") {
                console.log(`↩ Skipped (not gzip): ${key}`);
                continue;
            }

            // 🔹 OPTIONAL: Only Intelligent Tiering
            if (head.StorageClass && head.StorageClass !== "INTELLIGENT_TIERING") {
                console.log(`↩ Skipped (storage class): ${key}`);
                continue;
            }

            if (!head.ContentType?.startsWith("image/")) {
                console.log(`↩ Skipped (not image): ${key}`);
                continue;
            }

            // 🔹 DOWNLOAD
            const { Body } = await s3.send(
                new GetObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    Key: key,
                })
            );

            const gzipBuffer = await streamToBuffer(Body);
            const originalBuffer = zlib.gunzipSync(gzipBuffer);

            // 🔹 SHARP COMPRESSION
            const optimizedBuffer = await sharp(originalBuffer)
                .resize({ width: 1600, withoutEnlargement: true })
                .webp({ quality: 45, effort: 6 })
                .toBuffer();

            // 🔹 OVERWRITE SAME KEY
            await s3.send(
                new PutObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    Key: key,
                    Body: optimizedBuffer,
                    ContentType: "image/webp",
                    CacheControl: "no-cache",
                    StorageClass: "INTELLIGENT_TIERING",
                    ServerSideEncryption: "AES256",
                })
            );

            processed++;
            console.log(`✔ Replaced (${processed}): ${key}`);
        } catch (err) {
            console.error(`✖ Failed: ${key}`, err.message);
        }
    }

    console.log(`✅ Completed. Total processed: ${processed}`);
}

export async function renameWebpFilesByNames(fileNames = []) {
    const AWS_REGION = process.env.AWS_REGION;
    const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

    const s3 = new S3Client({
        region: AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    let processed = 0;

    for (const fileName of fileNames) {
        // 🔹 Only .webp files
        if (!fileName || !fileName.endsWith(".webp")) {
            console.log(`↩ Skipped: ${fileName}`);
            continue;
        }

        const oldKey = fileName;                 // since you pass only file names
        const newKey = fileName.replace(/\.webp$/i, "");

        try {
            // 🔹 Ensure object exists + get metadata
            const head = await s3.send(
                new HeadObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    Key: oldKey,
                })
            );

            // 🔹 Copy to new key
            await s3.send(
                new CopyObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    CopySource: `${AWS_BUCKET_NAME}/${oldKey}`,
                    Key: newKey,
                    ContentType: head.ContentType,
                    CacheControl: head.CacheControl,
                    StorageClass: head.StorageClass || "INTELLIGENT_TIERING",
                    MetadataDirective: "COPY",
                    ServerSideEncryption: "AES256",
                })
            );

            // 🔹 Delete old key
            await s3.send(
                new DeleteObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    Key: oldKey,
                })
            );

            processed++;
            console.log(`✔ Renamed: ${oldKey} → ${newKey}`);
        } catch (err) {
            console.error(`✖ Failed: ${oldKey}`, err.message);
        }
    }

    console.log(`✅ Completed. Total renamed: ${processed}`);
}