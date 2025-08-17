import {
  getApplicationDetailsByApplicationId,
  getDocumentApplicationDetailsById,
  getApplicationStatusHistoryById,
  updateEnquiryStatusModel,
  setExternelApiLog,
  savethirdpartyVerifyStatus,
  getAadharDetailsByapplicationIdModel,
  updateAADHAARInfoModel,
  updateAADHAARInfoModelV2,
  getApplicationCountMasterAdminModel,
  getApplicationCountMasterAdminModelV1,
  
} from "../models/applicationModel.js";
import { saveTransactionHistory } from "../models/logModel.js";
import logger from "../utils/logger.js";
import { sendSMSInternally } from "./thirdPartyAPI.js";

export const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const entryUserId = req.user.UserID;
    // console.log("entryUserId", entryUserId);
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

    // const saveTransaction = await saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, applicationId, OperationName, json, entryUserId)
    // // console.log(saveTransaction);

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
      mobile
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

      if(StatusText == "SP APPROVED" || StatusText == "SP NOT APPROVE"){
        // const shortenURLResponse = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(filepath)}`);
        // const shortenURL = shortenURLResponse.data;
        const smstext = `Your police verification for Passport Application No. ${ApplicationID} has been completed. Verification Status: ${StatusText == "SP APPROVED" ? "Apporved by verification autority" : "Rejected by verification autority"} - WB Police`;
        const mobileNumber = mobile;
        const smsCategory = "verification completed";
        const tpid = "1307174023428206731";
  
        const smsStatus = await sendSMSInternally(smstext, mobileNumber, smsCategory, tpid);
        return res.status(200).json({
          status: 0,
          message: "Status has been updated successfully",
          smsStatus,
          smstext
        });
      } else {
        return res.status(200).json({
          status: 0,
          message: "Status has been updated successfully",
          smsStatus: "N/A",
          smstext: "N/A"
        });
      }
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
    // console.log("setExternelApiLog", externelApiLogresponse);
    
    const statusUpdateResponse = await savethirdpartyVerifyStatus(
      ApplicationId,
      DocumentID,
      1,
      APIResponse,
      EntryUserID
    );
    // console.log("savethirdpartyVerifyStatus", statusUpdateResponse);

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
    // console.log("entryUserId", entryUserId);
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
    // // console.log(saveTransaction);

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



  export const getAadharDetailsByapplicationId = async (req, res) => {
    try {
      const { ApplicationId  } = req.body;
      const EntryuserId  = req.user.UserID; // Extract logged-in user ID
  
      if (!ApplicationId || !EntryuserId) {
        return res.status(400).json({
          status: 1,
          message: 'Invalid input data. All fields are required.',
        });
      }
  
      const applicationStatuses = await getAadharDetailsByapplicationIdModel(ApplicationId , EntryuserId );
  
      return res.status(200).json({
        status: 0,
        message: 'Application statuses retrieved successfully',
        data: applicationStatuses,
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




  export const updateAADHAARInfo = async (req, res) => {
    try {
      const {
        ApplicationID,
        AadharNumber,
        AadhaarName ,
        AadhaarDOB ,
        AadharVerifiedStatus ,
        AadhaarFatherName ,
        AadhaarGender ,
        AadhaarAddress

      } = req.body;
  
      const result = await updateAADHAARInfoModel(
        ApplicationID,
        AadharNumber,
        AadhaarName,
        AadhaarDOB,
        AadharVerifiedStatus,
        AadhaarFatherName,
        AadhaarGender,
        AadhaarAddress,
        req.user.UserID
      );
  
      if (result == 0) {
        logger.debug(
          JSON.stringify({
            API: "updateAADHAARInfo",
            REQUEST: {
              ApplicationID,
              AadhaarName,
              AadharNumber,
              AadhaarName ,
              AadhaarDOB,
              AadharVerifiedStatus,
              AadhaarFatherName,
              AadhaarGender,
              AadhaarAddress,
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
            API: "updateAADHAARInfo",
            REQUEST: {
              ApplicationID,
              AadhaarName,
              AadharNumber,
              AadhaarName,
              AadhaarDOB,
              AadharVerifiedStatus,
              AadhaarFatherName,
              AadhaarGender,
              AadhaarAddress,
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

  export const updateAADHAARInfoV2 = async (req, res) => {
    try {
      const {
        ApplicationID,
        AadharNumber,
        AadhaarName ,
        AadhaarDOB ,
        AadharVerifiedStatus ,
        AadhaarFatherName ,
        AadhaarGender ,
        AadhaarAddress,
        AadharRemarks

      } = req.body;
  
      const result = await updateAADHAARInfoModelV2(
        ApplicationID,
        AadharNumber,
        AadhaarName,
        AadhaarDOB,
        AadharVerifiedStatus,
        AadhaarFatherName || "N/A",
        AadhaarGender,
        AadhaarAddress,
        AadharRemarks,
        req.user.UserID
      );

      // console.log("updateAADHAARInfoModelV2:", result);
  
      if (result == 0) {
        logger.debug(
          JSON.stringify({
            API: "updateAADHAARInfo",
            REQUEST: {
              ApplicationID,
              AadhaarName,
              AadharNumber,
              AadhaarName ,
              AadhaarDOB,
              AadharVerifiedStatus,
              AadhaarFatherName,
              AadhaarGender,
              AadhaarAddress,
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
            API: "updateAADHAARInfo",
            REQUEST: {
              ApplicationID,
              AadhaarName,
              AadharNumber,
              AadhaarName,
              AadhaarDOB,
              AadharVerifiedStatus,
              AadhaarFatherName,
              AadhaarGender,
              AadhaarAddress,
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


  export const getApplicationCountMasterAdmin = async (req, res) => {
    try {
      const { districtId, startDate, endDate } = req.body;
      const userId = req.user.UserID;
  
      if (!userId) {
        logger.debug(
          JSON.stringify({
            API: "getApplicationCountMasterAdmin",
            REQUEST: { userId, districtId, startDate, endDate },
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
  
      const [applicationCounts] = await getApplicationCountMasterAdminModel(
        userId,
        districtId,
        startDate,
        endDate
      );
  
      logger.debug(
        JSON.stringify({
          API: "getApplicationCountMasterAdmin",
          REQUEST: { userId, districtId, startDate, endDate },
          RESPONSE: {
            status: 0,
            message: "Application count retrieved successfully",
            data: applicationCounts,
          },
        })
      );
  
      return res.status(200).json({
        status: 0,
        message: "Application count retrieved successfully",
        data: {
          applicationCounts,
        },
      });
    } catch (error) {
      logger.error("Error retrieving application count:", error);
      return res.status(500).json({
        status: 1,
        message: "An error occurred while retrieving the application count",
        error: error.message,
      });
    }
  };

  export const getApplicationCountMasterAdminV1 = async (req, res) => {
    try {
      const { districtId, startDate, endDate } = req.body;
      const userId = req.user.UserID;
  
      if (!userId) {
        logger.debug(
          JSON.stringify({
            API: "getApplicationCountMasterAdminV1",
            REQUEST: { userId, districtId, startDate, endDate },
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
  
      const [applicationCounts] = await getApplicationCountMasterAdminModelV1(
        userId,
        districtId,
        startDate,
        endDate
      );
  
      logger.debug(
        JSON.stringify({
          API: "getApplicationCountMasterAdminV1",
          REQUEST: { userId, districtId, startDate, endDate },
          RESPONSE: {
            status: 0,
            message: "Application count retrieved successfully",
            data: applicationCounts,
          },
        })
      );
  
      return res.status(200).json({
        status: 0,
        message: "Application count retrieved successfully",
        data: {
          applicationCounts,
        },
      });
    } catch (error) {
      logger.error("Error retrieving application count:", error);
      return res.status(500).json({
        status: 1,
        message: "An error occurred while retrieving the application count",
        error: error.message,
      });
    }
  };
  



