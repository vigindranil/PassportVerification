import { getSpecialEnquiryOfficersModel ,assignApplicationToSEModel, getStatusbySEModal} from '../models/enquiryOfficerModel.js';

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
      data: result || [],
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
    const EntryuserId  = req.user.UserID; // Extract logged-in user ID

    if (!applicationId || !assignTo || !macAddress || !locationIp || !deviceId || !EntryuserId ) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid input data. All fields are required.',
      });
    }

    const result = await assignApplicationToSEModel(applicationId, assignTo, macAddress, locationIp, deviceId, EntryuserId );

    if (result==0) {
      return res.status(200).json({
        status: 0,
        message: "Assigned Successfully",
      });
    } else {
      return res.status(400).json({
        status: 1,
        message: "Failed to assign",
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




  export const getApplicationStatus = async (req, res) => {
    try {
      const { status, period } = req.body;
      const userId = req.user.UserID; // Extract logged-in user ID
  
      if (!userId || !status || !period) {
        return res.status(400).json({
          status: 1,
          message: 'Invalid input data. All fields are required.',
        });
      }
  
      const applicationStatuses = await getStatusbySEModal(userId, status, period);
  
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