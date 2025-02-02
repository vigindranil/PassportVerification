import {
  getApplicationDetailsByApplicationId,
  getDocumentApplicationDetailsById,
  getApplicationStatusHistoryById,
  updateEnquiryStatusModel,
  setExternelApiLog,
  savethirdpartyVerifyStatus,
  updateAADHAARInfo,
} from "../models/applicationModel.js";
import { saveTransactionHistory } from "../models/logModel.js";
import logger from "../utils/logger.js";

export const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const entryUserId = req.user.UserID;
    console.log("entryUserId", entryUserId);
    const filepath = process.env.FILE_UPLOAD_PATH;
    if (!applicationId || !entryUserId) {
      logger.debug(
        JSON.stringify({
          API: "getApplicationDetails",
          REQUEST: { applicationId, entryUserId },
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

    const applicationDetails = await getApplicationDetailsByApplicationId(
      applicationId,
      entryUserId
    );

    const documents = await getDocumentApplicationDetailsById(
      applicationId,
      entryUserId
    );
    const status = await getApplicationStatusHistoryById(
      applicationId,
      entryUserId
    );

    const ipaddress = "test";
    const macAddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "getApplicationDetails";
    const json = "{}";

    // const saveTransaction = await saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, 0, OperationName, json, entryUserId)
    // console.log(saveTransaction);

    logger.debug(
      JSON.stringify({
        API: "getApplicationDetails",
        REQUEST: { applicationId, entryUserId },
        RESPONSE: {
          status: 0,
          message: "Application details retrieved successfully",
          data: {
            applicationDetails,
            documents: documents || [],
            status: status || [],
            filepath,
          },
        },
      })
    );
    return res.status(200).json({
      status: 0,
      message: "Application details retrieved successfully",
      data: {
        applicationDetails,
        documents: documents || [],
        status: status || [],
        filepath,
      },
    });
  } catch (error) {
    logger.error("Error retrieving application details:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while retrieving the application details",
      error: error.message,
    });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const {
      ApplicationID,
      locationIp,
      macAddress,
      deviceId,
      StatusID,
      StatusText,
      Remarks,
    } = req.body;

    const result = await updateEnquiryStatusModel(
      ApplicationID,
      locationIp,
      macAddress,
      deviceId,
      StatusID,
      StatusText,
      Remarks,
      req.user.UserID
    );

    if (result == 0) {
      logger.debug(
        JSON.stringify({
          API: "updateEnquiryStatus",
          REQUEST: {
            ApplicationID,
            locationIp,
            macAddress,
            deviceId,
            StatusID,
            StatusText,
            Remarks,
          },
          RESPONSE: {
            status: 0,
            message: "Status has been updated successfully",
          },
        })
      );
      return res.status(200).json({
        status: 0,
        message: "Status has been updated successfully",
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "updateEnquiryStatus",
          REQUEST: {
            ApplicationID,
            locationIp,
            macAddress,
            deviceId,
            StatusID,
            StatusText,
            Remarks,
          },
          RESPONSE: {
            status: 1,
            message: "Failed to update enquiry status",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Failed to update enquiry status",
      });
    }
  } catch (error) {
    logger.error("Error in updateEnquiryStatusController:", error.message);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while updating the enquiry status.",
      error: error.message,
    });
  }
};

export const completeVerificationForEO = async (req, res) => {
  try {
    const {
      ApplicationID,
      AadhaarName,
      AadhaarDOB,
      AadhaarFatherName,
      AadhaarGender,
      AadhaarAddress,
      locationIp,
      macAddress,
      deviceId,
      Remarks,
    } = req.body;
    const EntryUserID = req.user.UserID;

    const resultUpdateEnquiry = await updateEnquiryStatusModel(
      ApplicationID,
      locationIp,
      macAddress,
      deviceId,
      10,
      "Verification Complete (EO)",
      Remarks,
      EntryUserID
    );

    const resultUpdateAadhaarEnquiry = await updateAADHAARInfo(
      ApplicationID,
      AadhaarName,
      AadhaarDOB,
      1,
      AadhaarFatherName,
      AadhaarGender,
      AadhaarAddress,
      EntryUserID,
    );

    if (resultUpdateAadhaarEnquiry == 0 && resultUpdateEnquiry == 0) {
      logger.debug(
        JSON.stringify({
          API: "completeVerificationForEO",
          REQUEST: {
            ApplicationID,
            AadhaarName,
            AadhaarDOB,
            AadhaarFatherName,
            AadhaarGender,
            AadhaarAddress,
            locationIp,
            macAddress,
            deviceId,
            Remarks,
            EntryUserID
          },
          RESPONSE: {
            status: 0,
            message: "Status has been updated successfully",
          },
        })
      );
      return res.status(200).json({
        status: 0,
        message: "Status has been updated successfully",
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "completeVerificationForEO",
          REQUEST: {
            ApplicationID,
            AadhaarName,
            AadhaarDOB,
            AadhaarFatherName,
            AadhaarGender,
            AadhaarAddress,
            locationIp,
            macAddress,
            deviceId,
            Remarks,
            EntryUserID
          },
          RESPONSE: {
            status: 1,
            message: "Failed to update enquiry status",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Failed to update enquiry status",
      });
    }
  } catch (error) {
    logger.error("Error in updateEnquiryStatusController:", error.message);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while updating the enquiry status.",
      error: error.message,
    });
  }
};

export const verifyApplication = async (req, res) => {
  try {
    const {
      APITypeId,
      APIName,
      ApplicationId,
      DocumentID,
      APIRequest,
      APIResponse,
      Remarks,
    } = req.body;
    const EntryUserID = req.user.UserID;

    const externelApiLogresponse = await setExternelApiLog(
      APITypeId,
      ApplicationId,
      APIName,
      APIRequest,
      APIResponse,
      EntryUserID,
      Remarks
    );
    console.log("setExternelApiLog", externelApiLogresponse);
    
    const statusUpdateResponse = await savethirdpartyVerifyStatus(
      ApplicationId,
      DocumentID,
      10,
      APIResponse,
      EntryUserID
    );
    console.log("savethirdpartyVerifyStatus", statusUpdateResponse);

    if (externelApiLogresponse == 0 && statusUpdateResponse == 0) {
      logger.debug(
        JSON.stringify({
          API: "verifyApplication",
          REQUEST: {
            APITypeId,
            APIName,
            ApplicationId,
            DocumentID,
            APIRequest,
            APIResponse,
            Remarks,
            EntryUserID,
          },
          RESPONSE: {
            status: 0,
            message: "Document has been verified successfully",
          },
        })
      );
      return res.status(200).json({
        status: 0,
        message: "Document has been verified successfully",
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "updateEnquiryStatus",
          REQUEST: {
            APITypeId,
            APIName,
            ApplicationId,
            DocumentID,
            APIRequest,
            APIResponse,
            Remarks,
            EntryUserID,
          },
          RESPONSE: {
            status: 1,
            message: "Failed to update status",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Failed to update status",
      });
    }
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      status: 1,
      message: "An error occurred.",
      error: error.message,
    });
  }
};

export const getDocumentsApplicationDetailsByFileNo = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const entryUserId = req.user.UserID;
    console.log("entryUserId", entryUserId);
    const filepath = process.env.FILE_UPLOAD_PATH;
    if (!applicationId || !entryUserId) {
      logger.debug(
        JSON.stringify({
          API: "getDocumentsApplicationDetailsByFileNo",
          REQUEST: { applicationId, entryUserId },
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
    const documents = await getDocumentApplicationDetailsById(
      applicationId,
      entryUserId
    );

    const ipaddress = "test";
    const macAddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "getApplicationDetails";
    const json = "{}";

    // const saveTransaction = await saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, 0, OperationName, json, entryUserId)
    // console.log(saveTransaction);

    logger.debug(
      JSON.stringify({
        API: "getDocumentsApplicationDetailsByFileNo",
        REQUEST: { applicationId, entryUserId },
        RESPONSE: {
          status: 0,
          message: "Application details retrieved successfully",
          data: {
            documents: documents || [],
            filepath,
          },
        },
      })
    );
    return res.status(200).json({
      status: 0,
      message: "Application details retrieved successfully",
      data: {
        documents: documents || [],
        filepath,
      },
    });
  } catch (error) {
    logger.error("Error retrieving application details:", error);
    return res.status(500).json({
      status: 1,
      message: "An error occurred while retrieving the application details",
      error: error.message,
    });
  }
};
