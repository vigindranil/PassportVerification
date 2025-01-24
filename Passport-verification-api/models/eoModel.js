import pool from '../db.js';


export async function saveDocumentUploadModel(ApplicationId, DocumentPath, DocumentTypeId, EntryUserId) {
  try {
    const [rows] = await pool.query(
      'CALL sp_saveDocumentUpload(?, ?, ?, ?, @ErrorCode);',
      [ApplicationId, DocumentPath, DocumentTypeId, EntryUserId]
    );

    const [result] = await pool.query('SELECT @ErrorCode AS ErrorCode;');
    return result[0].ErrorCode; 
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}


export async function getDocumentUploadDetailsModel(ApplicationId, EntryUserId) {
    try {
      const [rows] = await pool.query(
        'CALL sp_getDocumentUploadDetails(?, ?);',
        [ApplicationId, EntryUserId]
      );
  
      return rows[0]; 
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }



  export async function saveCaseAssignModel(applicationId, citizenType, filePath, entryUserId) {
    try {
      const [rows] = await pool.query(
        'CALL sp_savecaseassign(?, ?, ?, ?, @application_Id, @ErrorCode); SELECT @application_Id AS application_Id, @ErrorCode AS ErrorCode;',
        [applicationId, citizenType, filePath, entryUserId]
      );
  
      const result = rows[1][0];
      return {
        applicationId: result.application_Id,
        errorCode: result.ErrorCode,
      };
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }