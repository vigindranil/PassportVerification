import axios from "axios";
import {
  saveDocumentUploadModel,
  getDocumentUploadDetailsModel,
  saveCaseAssignModel,
  getStatusByEOModel,
  getCountEOModel,
} from "../models/eoModel.js";
import { saveTransactionHistory } from "../models/logModel.js";
import logger from "../utils/logger.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { sendSMSInternally } from "./thirdPartyAPI.js";

export const saveDocumentUpload = async (req, res) => {
  try {
    const {
      DocDetailsID,
      ApplicationId,
      DocumentRemarks,
      DocumentTypeId,
      IdNumber,
      IdNumber2,
      IdNumber3,
      IdNumber4,
      IdNumber5,
      ipaddress,
      MacAddress,
      longitude,
      latitude,
      appDocId,
      DeviceId,
    } = req.body;

    const EntryUserId = req.user.UserID;
    const file = req.file;
    const filepath = req?.file_name;

    // console.log("req.file",req.file)
    if (!file) {
      logger.debug(
        JSON.stringify({
          API: "saveDocumentUpload",
          REQUEST: {
            DocDetailsID,
            ApplicationId,
            filepath,
            DocumentRemarks,
            DocumentTypeId,
            IdNumber,
            IdNumber2,
            IdNumber3,
            IdNumber4,
            IdNumber5,
            ipaddress,
            MacAddress,
            longitude,
            latitude,
            DeviceId,
            appDocId,
            EntryUserId,
          },
          RESPONSE: { status: 1, message: "No file uploaded" },
        })
      );
      return res.status(400).json({ status: 1, message: "No file uploaded" });
    }

    if (!ApplicationId || !DocumentTypeId || !EntryUserId) {
      logger.debug(
        JSON.stringify({
          API: "saveDocumentUpload",
          REQUEST: {
            DocDetailsID,
            ApplicationId,
            filepath,
            DocumentRemarks,
            DocumentTypeId,
            IdNumber,
            IdNumber2,
            IdNumber3,
            IdNumber4,
            IdNumber5,
            ipaddress,
            MacAddress,
            longitude,
            latitude,
            DeviceId,
            appDocId,
            EntryUserId,
          },
          RESPONSE: {
            status: 1,
            message: "Invalid input data",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Invalid input data",
      });
    }

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
      Key: `${ApplicationId}-${DocumentTypeId}`, // Unique name for the file
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

    const OperationName = "saveDocumentUpload";
    const json = "{}";
    const result = await saveDocumentUploadModel(
      DocDetailsID,
      ApplicationId,
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
      DocumentRemarks,
      DocumentTypeId,
      IdNumber,
      IdNumber2,
      IdNumber3,
      IdNumber4,
      IdNumber5,
      DeviceId,
      MacAddress,
      longitude,
      latitude,
      ipaddress,
      appDocId,
      EntryUserId
    );
    await saveTransactionHistory(
      ipaddress,
      MacAddress,
      longitude,
      latitude,
      0,
      OperationName,
      json,
      EntryUserId
    );
    if (result == 0) {
      logger.debug(
        JSON.stringify({
          API: "saveDocumentUpload",
          REQUEST: {
            ApplicationId,
            filepath,
            DocumentRemarks,
            DocumentTypeId,
            IdNumber,
            IdNumber2,
            IdNumber3,
            IdNumber4,
            IdNumber5,
            ipaddress,
            MacAddress,
            longitude,
            latitude,
            DeviceId,
            appDocId,
            EntryUserId,
          },
          RESPONSE: {
            status: 0,
            message: "Document uploaded successfully",
          },
        })
      );

      return res.status(200).json({
        status: 0,
        message: "Document uploaded successfully",
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
      });
    } else if (result == 3) {
      logger.debug(
        JSON.stringify({
          API: "saveDocumentUpload",
          REQUEST: {
            ApplicationId,
            DocumentRemarks,
            filepath,
            DocumentTypeId,
            IdNumber,
            IdNumber2,
            IdNumber3,
            IdNumber4,
            IdNumber5,
            ipaddress,
            MacAddress,
            longitude,
            latitude,
            DeviceId,
            appDocId,
            EntryUserId,
          },
          RESPONSE: {
            status: 1,
            message: "Failed to upload document",
          },
        })
      );

      return res.status(403).json({
        status: 1,
        message: "User does not have permission to upload documents",
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "saveDocumentUpload",
          REQUEST: {
            ApplicationId,
            DocumentRemarks,
            filepath,
            DocumentTypeId,
            IdNumber,
            IdNumber2,
            IdNumber3,
            IdNumber4,
            IdNumber5,
            ipaddress,
            MacAddress,
            longitude,
            latitude,
            DeviceId,
            appDocId,
            EntryUserId,
          },
          RESPONSE: {
            status: 1,
            message: "Failed to upload document",
          },
        })
      );

      return res.status(400).json({
        status: 1,
        message: "Failed to upload document",
      });
    }
  } catch (error) {
    console.error("Error saving document upload:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while saving document upload",
      error: error.message,
    });
  }
};

export const getDocumentUploadDetails = async (req, res) => {
  try {
    const { ApplicationId } = req.body;
    const EntryUserId = req.user.UserID;

    if (!ApplicationId || !EntryUserId) {
      logger.debug(
        JSON.stringify({
          API: "getDocumentUploadDetails",
          REQUEST: { ApplicationId, EntryUserId },
          RESPONSE: {
            status: 1,
            message: "Invalid input data",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Invalid input data",
      });
    }
    const ipaddress = "test";
    const macAddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "getDocumentUploadDetails";
    const json = "{}";
    // const saveTransaction = await saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, 0, OperationName, json, EntryUserId)
    const result = await getDocumentUploadDetailsModel(
      ApplicationId,
      EntryUserId
    );

    if (result.length > 0) {
      logger.debug(
        JSON.stringify({
          API: "getDocumentUploadDetails",
          REQUEST: { ApplicationId, EntryUserId },
          RESPONSE: {
            status: 0,
            message: "Document upload details fetched successfully",
            data: result,
          },
        })
      );
      return res.status(200).json({
        status: 0,
        message: "Document upload details fetched successfully",
        data: result,
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "getDocumentUploadDetails",
          REQUEST: { ApplicationId, EntryUserId },
          RESPONSE: {
            status: 1,
            message: "No document upload details found",
          },
        })
      );
      return res.status(404).json({
        status: 1,
        message: "No document upload details found",
      });
    }
  } catch (error) {
    logger.error("Error fetching document upload details:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while fetching document upload details",
      error: error.message,
    });
  }
};

export const saveCaseAssign = async (req, res) => {
  try {
    const {
      applicationId,
      citizentype,
      jsonTEXT,
      macAddress,
      locationIp,
      deviceId,
      dateOfBirth,
      mobile,
    } = req.body;
    const entryUserId = req.user.UserID;
    let filepath = "";
    let messageDocUrl = "";
    const fixedDoc = "wbpassportverify.link/uploads/doc.pdf";
    const dob = new Date(dateOfBirth);

    const pp_document = {
      "citizen_type_1_(1950-01-26_to_1987-06-30)": "https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_1_(1950-01-26_to_1987-06-30)",
      "citizen_type_1_(1987-07-01_to_2004-12-02)": "https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_1_(1987-07-01_to_2004-12-02)",
      "citizen_type_1_(2004-12-03_onwards)": "https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_1_(2004-12-03_onwards)",
      "citizen_type_2_Citizen_by_Naturalization": "https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_2_Citizen_by_Naturalization",
      "citizen_type_3_Citizen_by_Registration": "https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_3_Citizen_by_Registration",
      "citizen_type_4_Citizen_by_Descent": "https://wb-passport-verify.s3.ap-south-1.amazonaws.com/citizen_type_4_Citizen_by_Descent",
    }

    if (citizentype == 1) {
      if (dob >= new Date("1950-01-26") && dob < new Date("1987-07-01")) {
        filepath = pp_document["citizen_type_1_(1950-01-26_to_1987-06-30)"]
        messageDocUrl = "wbpassportverify.link/uploads/1.pdf";
      }
      else if (dob >= new Date("1987-07-01") && dob < new Date("2004-12-03")) {
        filepath = pp_document["citizen_type_1_(1987-07-01_to_2004-12-02)"]
        messageDocUrl = "wbpassportverify.link/uploads/2.pdf";
      }
      else if (dob >= new Date("2004-12-03")) {
        filepath = pp_document["citizen_type_1_(2004-12-03_onwards)"]
        messageDocUrl = "wbpassportverify.link/uploads/3.pdf";
      }
    }
    if (citizentype == 2) {
      filepath = pp_document["citizen_type_2_Citizen_by_Naturalization"]
      messageDocUrl = "wbpassportverify.link/uploads/4.pdf";
    }
    else if (citizentype == 3) {
      filepath = pp_document["citizen_type_3_Citizen_by_Registration"]
      messageDocUrl = "wbpassportverify.link/uploads/4.pdf";
    }
    else if (citizentype == 4) {
      filepath = pp_document["citizen_type_4_Citizen_by_Descent"]
      messageDocUrl = "wbpassportverify.link/uploads/4.pdf";
    }

    if (!applicationId || !citizentype) {
      return res.status(400).json({
        status: 1,
        message: "Invalid input data",
      });
    }
    const ipaddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "saveCaseAssign";
    const json = "{}";


    //  const saveTransaction = await saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, 0, OperationName, json, entryUserId)

    const errorCode = await saveCaseAssignModel(
      applicationId,
      citizentype,
      jsonTEXT,
      fixedDoc,
      macAddress,
      locationIp,
      deviceId,
      entryUserId
    );


    if (errorCode == 0) {
      logger.debug(
        JSON.stringify({
          API: "saveCaseAssignModel",
          REQUEST: {
            applicationId,
            citizentype,
            jsonTEXT,
            macAddress,
            locationIp,
            deviceId,
            entryUserId,
          },
          RESPONSE: {
            status: 0,
            message: "Case assigned successfully",
          },
        })
      );

      const smstext = `Passport Verification Process initiated ${applicationId}, required documents link ${fixedDoc} - WB Police`;
      const mobileNumber = mobile;
      // const mobileNumber = "6202734737";
      const smsCategory = "process initiated";
      const tpid = "1307174055755232946";

      const smsStatus = await sendSMSInternally(smstext, mobileNumber, smsCategory, tpid);

      return res.status(200).json({
        status: 0,
        message: "Case assigned successfully",
        file_path: fixedDoc,
        smsStatus,
        smstext
      });
    } else if (errorCode == 3) {
      return res.status(400).json({
        status: 1,
        message: "Logged in user does not have permission to add case",
      });
    } else if (errorCode == 4) {
      return res.status(400).json({
        status: 1,
        message: "Application is already assigned to another EO",
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "saveCaseAssignModel",
          REQUEST: {
            applicationId,
            citizentype,
            jsonTEXT,
            macAddress,
            locationIp,
            deviceId,
            entryUserId,
          },
          RESPONSE: {
            status: 1,
            message: "An error occurred while assigning the case",
          },
        })
      );
      return res.status(500).json({
        status: 1,
        message: "An error occurred while assigning the case",
      });
    }
  } catch (error) {
    logger.error("Error assigning case:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while assigning the case",
      error: error.message,
    });
  }
};

export const getStatusByEO = async (req, res) => {
  try {
    const { status, period } = req.body;
    const userId = req.user.UserID;
    if (!userId || !status || !period) {
      return res.status(400).json({ status: 1, message: "Invalid input data" });
    }

    const result = await getStatusByEOModel(userId, status, period);

    if (result == 0) {
      return res.status(200).json({
        status: 0,
        message: "Status fetched successfully",
        data: result,
      });
    } else {
      return res.status(404).json({ status: 1, message: "No records found" });
    }
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: "An error occurred while fetching status",
      error: error.message,
    });
  }
};

export const getCountEO = async (req, res) => {
  try {
    const userId = req.user.UserID; // Extract logged-in user ID

    if (!userId) {
      return res.status(400).json({
        status: 1,
        message: "Invalid input data. All fields are required.",
      });
    }

    const applicationStatuses = await getCountEOModel(userId);

    return res.status(200).json({
      status: 0,
      message: "Application statuses retrieved successfully",
      data: applicationStatuses[0],
    });
  } catch (error) {
    console.error("Error in getApplicationStatusController:", error.message);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while retrieving application statuses.",
      error: error.message,
    });
  }
};
