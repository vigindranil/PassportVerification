import { getSpecialEnquiryOfficers } from '../models/enquiryOfficerModel.js';

export const getSpecialEnquiryOfficersController = async (req, res) => {
  const EntryUserID = req.user.UserID; // Extracting from logged-in user

  try {
    if (!EntryUserID) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid input data. EntryUserID is required.',
      });
    }

    const result = await getSpecialEnquiryOfficers(EntryUserID);

    return res.status(200).json({
      status: 0,
      message: result.message,
      officers: result.officers,
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
