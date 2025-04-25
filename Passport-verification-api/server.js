import express from "express";
import dotenv from "dotenv";
dotenv.config();
import loginRoutes from "./routes/login.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import fileImportRoutes from "./routes/fileImport.js";
import verifyToken from "./middleware/authMiddleware.js";
import thirtPartyVerifyToken from "./middleware/thirdPartyApiAuthMiddleware.js";
import masterRoutes from "./routes/master.js";
import cors from "cors";
import multer from "multer";
import setupSwagger from "./utils/swagger.js";
import eoDocumentUpload from "./routes/eoRoutes.js";
import getApplicationDetails from "./routes/application.js";
import uploadRoutes from "./routes/upload.js";
import logRoutes from "./routes/logs.js";
import thirdPartyRoutes from "./routes/thirdPartyAPI.js";
import path from "path";
import { fileURLToPath } from "url";
import getSpecialEnquiryOfficers from "./routes/enquiryOfficer.js";
import updateCriminalInfo from './routes/crime.js';
import transferapplication from './routes/spRoutes.js'
import requireDocument from './routes/requiredDocsRoutes.js'
import s3uploadRoutes from "./routes/s3-upload.js";
import s3downloadRoutes from "./routes/s3-download.js";
import stateAdminRoutes from "./routes/stateAdmin.js";

const app = express();
const port = 3003;
// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const uploadPath = process.env.FILE_UPLOAD_PATH;
const uploadPath = path.join(__dirname, "uploads");
// Serve static files
app.use("/uploads", express.static(uploadPath));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: "*",
    methods: "*",
    credentials: true,
  })
);

// for excel upload
const tempStorage = multer.memoryStorage();
const excelupload = multer({
  tempStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//public Route
app.use("/api/", logRoutes);
app.use("/api/auth/", loginRoutes);
app.use("/api/third-party/v2", thirtPartyVerifyToken, thirdPartyRoutes);
app.use("/api/third-party/", verifyToken, thirdPartyRoutes);
app.use("/api/s3-upload", upload.single("file"), s3uploadRoutes);
app.use("/api/s3-download", s3downloadRoutes);

//private Route
app.use("/api/auth/", verifyToken, authRoutes);
app.use("/api/user/", verifyToken, userRoutes);
app.use("/api/master", verifyToken, masterRoutes);
app.use("/api/eo", verifyToken, eoDocumentUpload);
app.use("/api/application", verifyToken, getApplicationDetails);
app.use("/api/fileUpload", verifyToken, fileImportRoutes);
app.use("/api/enquiryOfficers", verifyToken, getSpecialEnquiryOfficers)
app.use("/api/upload", verifyToken, upload.single("file"), uploadRoutes);
app.use("/api/crime", verifyToken, updateCriminalInfo);
app.use("/api/sp", verifyToken, transferapplication)
app.use("/api/documents", verifyToken, requireDocument)
app.use("/api/stateadmin", verifyToken, stateAdminRoutes)
app.use(
  "/api/fileImport",
  verifyToken,
  excelupload.single("file"),
  fileImportRoutes
);

// test route
app.use("/test", (req, res) => {
  res.send("api running...");
});

setupSwagger(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
  console.log(`API log is available at http://localhost:${port}/api/logs?file=debug.log`);
  console.log(`API log is available at http://localhost:${port}/api/logs?file=error.log`);
});
