import {
    S3Client,
    ListObjectsV2Command,
    HeadObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import zlib from "zlib";



export async function migrateGzipImagesByDateRange(startDate, endDate) {
    try {
        const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
        const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
        const AWS_REGION = process.env.AWS_REGION
        const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
        const streamToBuffer = async (stream) => {
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            return Buffer.concat(chunks);
        };
        const s3 = new S3Client({ region: AWS_REGION, credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY } });
        const start = new Date(startDate);
        const end = new Date(endDate);

        let continuationToken;


        do {
            const listResponse = await s3.send(
                new ListObjectsV2Command({
                    Bucket: AWS_BUCKET_NAME,
                    ContinuationToken: continuationToken,
                })
            );

            console.log("records", listResponse.Contents);

            for (const obj of listResponse.Contents || []) {
                const lastModified = new Date(obj.LastModified);

                // 🔹 DATE FILTER
                if (lastModified < start || lastModified > end) continue;

                try {
                    // 🔹 HEAD → ONLY GZIP FILES
                    const head = await s3.send(
                        new HeadObjectCommand({
                            Bucket: AWS_BUCKET_NAME,
                            Key: obj.Key,
                        })
                    );

                    if (head.ContentEncoding !== "gzip") continue;
                    if (!head.ContentType?.startsWith("image/")) continue;

                    // 🔹 DOWNLOAD
                    const { Body } = await s3.send(
                        new GetObjectCommand({
                            Bucket: AWS_BUCKET_NAME,
                            Key: obj.Key,
                        })
                    );

                    const gzipBuffer = await streamToBuffer(Body);

                    // 🔹 GUNZIP
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
                            Key: obj.Key, // 🔥 SAME KEY
                            Body: optimizedBuffer,
                            ContentType: "image/webp",
                            StorageClass: "INTELLIGENT_TIERING",
                            ServerSideEncryption: "AES256",
                        })
                    );

                    console.log(`✔ Replaced: ${obj.Key}`);
                } catch (err) {
                    console.error(`✖ Failed: ${obj.Key}`, err.message);
                }
            }

            continuationToken = listResponse.IsTruncated
                ? listResponse.NextContinuationToken
                : null;
        } while (continuationToken);

        console.log("✅ Migration completed");
    } catch (error) {
        console.error("Migration error:", error);
        throw error;

    }
}
