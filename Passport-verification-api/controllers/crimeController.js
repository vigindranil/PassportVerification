import {updateCriminalInfoModel} from '../models/crimeModel.js'
import logger from "../utils/logger.js";

export const updateCriminalInfo = async (req, res) => {
    try {
      const {
        ApplicationID,
        CaseRefferenceNumber ,
        PSName,
        CriminalStatus ,
        CriminalStatusRemarks ,
        
      } = req.body;
  
      const result = await updateCriminalInfoModel(
        ApplicationID,
        CaseRefferenceNumber,
        PSName,
        CriminalStatus,
        CriminalStatusRemarks,
        
        req.user.UserID
      );
  
      if (result == 0) {
        logger.debug(
          JSON.stringify({
            API: "updateCriminalInfo",
            REQUEST: {
                ApplicationID,
                CaseRefferenceNumber ,
                PSName ,
                CriminalStatus,
                CriminalStatusRemarks ,
             
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
            API: "updateCriminalInfo",
            REQUEST: {
                ApplicationID,
                CaseRefferenceNumber ,
                PSName ,
                CriminalStatus ,
                CriminalStatusRemarks ,
              
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