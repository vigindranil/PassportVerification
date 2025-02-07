import pool from "../db.js";


export async function updateCriminalInfoModel(
    ApplicationID,
    CaseRefferenceNumber ,
    PSName ,
    CriminalStatus,
    CriminalStatusRemarks,
    CriminalRecordType,
    EntryUserID,
  ) {
    try {
      const [rows] = await pool.query(
        `CALL sp_updateCriminalInfo(?,?,?, ?, ?,?, ?, @ErrorCode)`,
        [
          ApplicationID,
          CaseRefferenceNumber ,
          PSName ,
          CriminalStatus ,
          CriminalStatusRemarks,
          CriminalRecordType,
          EntryUserID,
        ]
      );
  
      const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
      console.log("result", result[0].ErrorCode);
      return result[0].ErrorCode;
    } catch (error) {
      throw new Error("Database error: " + error.message);
    }
  }