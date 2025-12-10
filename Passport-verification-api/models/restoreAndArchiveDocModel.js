import pool from '../db.js';

export async function updateDocumentRestoreStatusByDocumentId(DocumentId, ArchiveId, RestoreId) {
    try {
      const [rows] = await pool.query(
        "CALL sp_UpdateDocumentRestoreStatusByDocumentId( ?, ?, ?, @ErrorCode);",
        [DocumentId, ArchiveId, RestoreId]
      );
  
      const [result] = await pool.query(
        "SELECT @ErrorCode AS ErrorCode;"
      );
      
      return result[0].ErrorCode;
    } catch (error) {
      throw new Error("Database error: " + error.message);
    }
  }