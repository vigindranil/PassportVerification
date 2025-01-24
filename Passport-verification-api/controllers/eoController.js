import { saveDocumentUploadModel } from '../models/eoModel.js';


export const saveDocumentUpload = async (req, res) => {
  try {
    const { ApplicationId, DocumentPath, DocumentTypeId } = req.body;
    const EntryUserId = req.user.UserID; 

   
    if (!ApplicationId || !DocumentPath || !DocumentTypeId || !EntryUserId) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid input data',
      });
    }

    const result = await saveDocumentUploadModel(ApplicationId, DocumentPath, DocumentTypeId, EntryUserId);

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
