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
  
      return rows[0]; // Return the result of the stored procedure
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }