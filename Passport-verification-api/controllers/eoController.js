import { saveDocumentUploadModel, getDocumentUploadDetailsModel, saveCaseAssignModel } from '../models/eoModel.js';
import { saveTransactionHistory } from '../models/logModel.js'

export const saveDocumentUpload = async (req, res) => {
  try {
    const { ApplicationId, DocumentPath, DocumentTypeId, ipaddress, MacAddress, longitude, latitude, DeviceId
    } = req.body;
    const EntryUserId = req.user.UserID;


    if (!ApplicationId || !DocumentPath || !DocumentTypeId || !EntryUserId) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid input data',
      });
    }

    const OperationName = "saveDocumentUpload";
    const json = "{}"
    const result = await saveDocumentUploadModel(ApplicationId, DocumentPath, DocumentTypeId, DeviceId, MacAddress, longitude, latitude, ipaddress, EntryUserId);
    // await saveTransactionHistory(ipaddress, MacAddress, longitude, latitude, ApplicationId, OperationName, json, EntryUserId)
    switch (result) {
      case 0:
        return res.status(200).json({
          status: 0,
          message: 'Document uploaded successfully',

        });
      case 3:
        return res.status(403).json({
          status: 1,
          message: 'User does not have permission to upload documents',
        });
      default:
        return res.status(400).json({
          status: 1,
          message: 'Failed to upload document',
        });
    }
  } catch (error) {
    console.error('Error saving document upload:', error);
    return res.status(500).json({
      status: 1,
      message: 'An error occurred while saving document upload',
      error: error.message,
    });
  }
};


export const getDocumentUploadDetails = async (req, res) => {
  try {
    const { ApplicationId } = req.body;
    const EntryUserId = req.user.UserID;


    if (!ApplicationId || !EntryUserId) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid input data',
      });
    }
    const ipaddress = "test";
    const macAddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "getDocumentUploadDetails";
    const json = "{}"
    // const saveTransaction = await saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, ApplicationId, OperationName, json, EntryUserId)
    const result = await getDocumentUploadDetailsModel(ApplicationId, EntryUserId);

    if (result.length > 0) {
      return res.status(200).json({
        status: 0,
        message: 'Document upload details fetched successfully',
        data: result,
      });
    } else {
      return res.status(404).json({
        status: 1,
        message: 'No document upload details found',
      });
    }
  } catch (error) {
    console.error('Error fetching document upload details:', error);
    return res.status(500).json({
      status: 1,
      message: 'An error occurred while fetching document upload details',
      error: error.message,
    });
  }
};



export const saveCaseAssign = async (req, res) => {
  try {
    const {
      applicationId,
      citizentype,
    
      macAddress,
      locationIp,
      deviceId } = req.body;
    const entryUserId = req.user.UserID;
    const file = req.file;
    const filepath = req?.file_name;

    if (!file) {
      return res.status(400).json({ status: 1, message: "No file uploaded" });
    }

    if (
      !applicationId ||
      !citizentype 
    
    ) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid input data',
      });
    }
    const ipaddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "saveCaseAssign";
    const json = "{}"

    console.log("entryUserId", entryUserId);
    
    // const saveTransaction = await saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, applicationId, OperationName, json, entryUserId)

    const errorCode = await saveCaseAssignModel(
      applicationId,
      citizentype,
      
      filepath,
      macAddress,
      locationIp,
      deviceId,
      entryUserId
    );

    console.log("errorCode",errorCode);

    if (errorCode == 0) {
      return res.status(200).json({
        status: 0,
        message: 'Case assigned successfully',
       
      });
    } else if (errorCode === 3) {
      return res.status(400).json({
        status: 1,
        message: 'Logged in user does not have permission to add case',
      });
    } else {
      return res.status(500).json({
        status: 1,
        message: 'An error occurred while assigning the case',
      });
    }
  } catch (error) {
    console.error('Error assigning case:', error);
    return res.status(500).json({
      status: 1,
      message: 'An error occurred while assigning the case',
      error: error.message,
    });
  }
};