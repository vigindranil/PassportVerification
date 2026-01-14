import { uploadToFTP } from "../utils/ftpConfig.js";

class UploadController {
    static async uploadFile(req, res) {
        try {
            const files = req.files;


            if (!files || files.length === 0) {
                return res.status(400).json({
                    status: 1,
                    message: "At least one image file must be uploaded.",
                });
            }

            let uploadedPaths = [];
            for (const file of files) {
                const remoteFilePath = await uploadToFTP(file.buffer, file.originalname);
                if (!remoteFilePath) {
                    console.error("❌ FTP Upload Failed for file:", file.originalname);
                    continue;
                }
                console.log("✅ File uploaded to FTP:", remoteFilePath);
                uploadedPaths.push(remoteFilePath);
            }

            // Ensure we are sending at least one uploaded image
            if (uploadedPaths.length === 0) {
                return res.status(500).json({
                    status: 1,
                    message: "Failed to upload any images to FTP server.",
                });
            }

            // Map uploaded files to the correct SP inputs
            const ImageFileOne = uploadedPaths[0] || null;
            if (ImageFileOne) {
                return res.status(200).json({
                    status: 0,
                    message: "Images uploaded and linked to Arresstee successfully.",
                    uploadedPaths: ImageFileOne,
                });
            } else {
                return res.status(500).json({
                    status: 1,
                    message: "Failed to save uploaded images to the Arresstee record.",
                });
            }

        } catch (error) {
            return res.status(500).json({
                status: 1,
                message: "An unexpected error occurred while uploading Arresstee images.",
            });
        }
    }

}

export default UploadController;