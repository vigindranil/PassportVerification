import {
  saveDocumentUploadModel,
  getDocumentUploadDetailsModel,
  saveCaseAssignModel,
  getStatusByEOModel,
  getCountEOModel,
} from "../models/eoModel.js";
import { saveTransactionHistory } from "../models/logModel.js";
import logger from "../utils/logger.js";

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
    console.log(file);

    console.log("ApplicationId", ApplicationId)
    console.log("DocumentRemarks", DocumentRemarks)
    console.log("DocumentTypeId", DocumentTypeId)
    console.log("IdNumber", IdNumber)
    console.log("IdNumber2", IdNumber2)
    console.log("IdNumber3", IdNumber3)
    console.log("IdNumber4", IdNumber4)
    console.log("IdNumber5", IdNumber5)
    console.log("DeviceId", DeviceId)
    console.log("MacAddress", MacAddress)
    console.log("longitude", longitude)
    console.log("latitude", latitude)
    console.log("appDocId", appDocId)
    console.log("EntryuserId", EntryUserId)
    

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

    const OperationName = "saveDocumentUpload";
    const json = "{}";
    const result = await saveDocumentUploadModel(
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
      DeviceId,
      MacAddress,
      longitude,
      latitude,
      ipaddress,
      appDocId,
      EntryUserId
    );
    await saveTransactionHistory(ipaddress, MacAddress, longitude, latitude, 0, OperationName, json, EntryUserId)
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
    } = req.body;
    const entryUserId = req.user.UserID;
    const file = req.file;
    const filepath = req?.file_name;

    if (!file) {
      return res.status(400).json({ status: 1, message: "No file uploaded" });
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

    console.log("entryUserId", entryUserId);

    //  const saveTransaction = await saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, 0, OperationName, json, entryUserId)

    const errorCode = await saveCaseAssignModel(
      DocDetailsID,
      applicationId,
      citizentype,
      jsonTEXT,
      filepath,
      macAddress,
      locationIp,
      deviceId,
      entryUserId
    );

    console.log("errorCode", errorCode);

    if (errorCode == 0) {
      logger.debug(
        JSON.stringify({
          API: "saveCaseAssignModel",
          REQUEST: {
            DocDetailsID,
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
      return res.status(200).json({
        status: 0,
        message: "Case assigned successfully",
      });
    } else if (errorCode === 3) {
      return res.status(400).json({
        status: 1,
        message: "Logged in user does not have permission to add case",
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "saveCaseAssignModel",
          REQUEST: {
            DocDetailsID,
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
    if (!userId || !status|| !period) {
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
  
      if (!userId ) {
        return res.status(400).json({
          status: 1,
          message: 'Invalid input data. All fields are required.',
        });
      }
  
      const applicationStatuses = await getCountEOModel(userId);
  
      return res.status(200).json({
        status: 0,
        message: 'Application statuses retrieved successfully',
        data: applicationStatuses[0],
      });
    } catch (error) {
      console.error('Error in getApplicationStatusController:', error.message);
      return res.status(500).json({
        status: 1,
        message: 'An error occurred while retrieving application statuses.',
        error: error.message,
      });
    }
  };