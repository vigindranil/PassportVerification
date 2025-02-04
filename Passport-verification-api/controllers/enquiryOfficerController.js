import { getSpecialEnquiryOfficersModel ,assignApplicationToSEModel} from '../models/enquiryOfficerModel.js';

export const getSpecialEnquiryOfficers = async (req, res) => {
  const EntryUserID = req.user.UserID; 

  try {
    if (!EntryUserID) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid input data. EntryUserID is required.',
      });
    }

    const result = await getSpecialEnquiryOfficersModel(EntryUserID);

    return res.status(200).json({
      status: 0,
      message: "data fetch susccfully",
      officers: result || [],
    });
  } catch (error) {
    console.error('Error in getSpecialEnquiryOfficersController:', error.message);
    return res.status(500).json({
      status: 1,
      message: 'Internal server error',
      error: error.message,
    });
  }
};




export const assignApplication = async (req, res) => {
  try {
    const { applicationId, assignTo, macAddress, locationIp, deviceId } = req.body;
    const entryUserId = req.user.UserID; // Extract logged-in user ID

    if (!applicationId || !assignTo || !macAddress || !locationIp || !deviceId || !entryUserId) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid input data. All fields are required.',
      });
    }

    const result = await assignApplicationToSEModel(applicationId, assignTo, macAddress, locationIp, deviceId, entryUserId);

    if (result.success) {
      return res.status(200).json({
        status: 0,
        message: result.message,
      });
    } else {
      return res.status(403).json({
        status: 1,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error in assignApplicationController:', error.message);
    return res.status(500).json({
      status: 1,
      message: 'An error occurred while assigning the application.',
      error: error.message,
    });
  }
};


