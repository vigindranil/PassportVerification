import express from "express";
import dotenv from "dotenv";
dotenv.config();
import loginRoutes from "./routes/login.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import fileImportRoutes from "./routes/fileImport.js";
import verifyToken from "./middleware/authMiddleware.js";
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


// for img / pdf and other docs upload
// Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     req.filePath = uploadPath;
//     cb(null, uploadPath); // Upload folder
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     req.file_name =file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//     );
//   },
// });

// // Initialize multer
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB file size limit
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|gif|pdf/;
//     const extname = fileTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimetype = fileTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error("File is not allowed to upload!"));
//     }
//   },
// });

//public Route
app.use("/api/", logRoutes);
app.use("/api/auth/", loginRoutes);
app.use("/api/third-party/", thirdPartyRoutes);

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
