import {transferapplicationModel} from '../models/spModel.js'
import logger from "../utils/logger.js";

export const transferapplication = async (req, res) => {
    try {
      const {
        applicationId,
        locationIp,
        deviceId ,
        remarks ,
        districtId ,
        psId ,
        macAddress ,
      } = req.body;
  
      const result = await transferapplicationModel(
        applicationId,
        locationIp,
        deviceId,
        remarks,
        districtId,
        psId,
        macAddress,
        req.user.UserID
      );
  
      console.log("result",result);
      
      if (result == 0) {
        logger.debug(
          JSON.stringify({
            API: "transferapplication",
            REQUEST: {
              applicationId,
              locationIp,
              deviceId,
              remarks,
              districtId,
              psId,
              macAddress,
            },
            RESPONSE: {
              status: 0,
              message: "Application has been  transfered successfully",
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
            API: "transferapplication",
            REQUEST: {
              applicationId,
              locationIp,
              deviceId,
              remarks,
              districtId,
              psId,
              macAddress,
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





 