import { getApplicationDetailsByApplicationId, getDocumentApplicationDetailsById, getApplicationStatusHistoryById } from '../models/applicationModel.js';


export const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const entryUserId = req.user.UserID; 
console.log("entryUserId", entryUserId);

    if (!applicationId || !entryUserId) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid input data',
      });
    }

    const applicationDetails = await getApplicationDetailsByApplicationId(applicationId, entryUserId);

    let documents = [];
    try {
      documents = await getDocumentApplicationDetailsById(applicationId, entryUserId);
    }catch (e) {
      documents = [];
    }
    let status = [];
    try {
      status = await getApplicationStatusHistoryById(applicationId, entryUserId);
    }catch (e) {
      status = [];
    }

    return res.status(200).json({
      status: 0,
      message: 'Application details retrieved successfully',
      data: {
        applicationDetails,
        documents: documents,
        status: status

    },
    });
  } catch (error) {
    console.error('Error retrieving application details:', error);
    return res.status(500).json({
      status: 1,
      message: 'An error occurred while retrieving the application details',
      error: error.message,
    });
  }
};
