import { getApplicationDetailsByApplicationId, getDocumentApplicationDetailsById, getApplicationStatusHistoryById , updateEnquiryStatusModel} from '../models/applicationModel.js';
import { saveTransactionHistory } from '../models/logModel.js'
import logger from '../utils/logger.js';


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
                      message: 'Invalid input data'
                },
            })
        );
            return res.status(400).json({
                status: 1,
                message: 'Invalid input data',
            });
        }

        const applicationDetails = await getApplicationDetailsByApplicationId(applicationId, entryUserId);


        // const documents = await getDocumentApplicationDetailsById(applicationId, entryUserId);
        const status = await getApplicationStatusHistoryById(applicationId, entryUserId);

         const ipaddress = "test";
         const macAddress = "test";
         const Longitude = "test";
         const Latitude = "test";
         const OperationName = "getApplicationDetails";
        const json = "{}"
        
        // const saveTransaction = await saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, 0, OperationName, json, entryUserId)
        // console.log(saveTransaction);
        
        logger.debug(
          JSON.stringify({
              API: "getApplicationDetails",
              REQUEST: { applicationId , entryUserId},
              RESPONSE: {
                status: 0,
                message: 'Application details retrieved successfully',
                data: {
                    applicationDetails,
                    documents: documents || [],
                    status: status || [],
                    filepath
                }
              },
          })
      );
        return res.status(200).json({
            status: 0,
            message: 'Application details retrieved successfully',
            data: {
                applicationDetails,
                documents: documents || [],
                status: status || [],
                filepath
            },
        });
    } catch (error) {
        logger.error('Error retrieving application details:', error);
        return res.status(500).json({
            status: 1,
            message: 'An error occurred while retrieving the application details',
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
      req.user.UserID, 
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
                message: "Status has been updated successfully"
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
            REQUEST: {   ApplicationID,
              locationIp,
              macAddress,
              deviceId,
              StatusID,
              StatusText,
              Remarks },
            RESPONSE: {
                 status: 1,
                message: 'Failed to update enquiry status'
            },
        })
    );
      return res.status(400).json({
        status: 1,
        message: 'Failed to update enquiry status',
      
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
//     const {
//         ApplicationID ,
//         locationIp ,
//         macAddress ,
//         deviceId ,
//         StatusID ,
//         StatusText ,
//         Remarks
//     } = req.body;
  
//     try {
//       if (!ApplicationID || !locationIp || !macAddress || !deviceId || !StatusID || !StatusText || !Remarks) {
//         return res.status(400).json({
//           status: 1,
//           message: 'Missing required fields.',
//         });
//       }
  
//       const result = await updateEnquiryStatusModel({
//         ApplicationID,
//         locationIp,
//         macAddress,
//         deviceId,
//         StatusID,
//         StatusText,
//         Remarks,
//         EntryUserID: req.user.UserID,
//       });
  
//       if (result.success) {
//         return res.status(200).json({
//           status: 0,
//           message: result.message,
//         });
//       } else {
//         return res.status(400).json({
//           status: 1,
//           message: result.message,
//           errorCode: result.errorCode,
//         });
//       }
//     } catch (error) {
//       console.error('Error in updateEnquiryStatusController:', error.message);
//       return res.status(500).json({
//         status: 1,
//         message: 'An error occurred while updating the enquiry status.',
//         error: error.message,
//       });
//     }
//   };


export const getApplicationDocumentsController = async (req, res) => {
  const { ApplicationId, EntryUserId } = req.body;

  try {
    if (!ApplicationId || !EntryUserId) {
      return res.status(400).json({
        status: 1,
        message: 'Missing required fields.',
      });
    }

    const result = await getDocumentApplicationDetailsById(ApplicationId, EntryUserId);

    return res.status(200).json({
      status: 0,
      message: result.message,
      documents: result.documents,
    });
  } catch (error) {
    console.error('Error in getApplicationDocumentsController:', error.message);
    return res.status(500).json({
      status: 1,
      message: 'Internal server error',
      error: error.message,
    });
  }
};