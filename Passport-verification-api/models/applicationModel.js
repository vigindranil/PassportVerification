import pool from '../db.js';



export async function getApplicationDetailsByApplicationId(applicationId, entryUserId) {
  try {
    const [rows] = await pool.query(
      `CALL sp_getApplicationDetailsByapplicationId(?, ?)`,
      [applicationId, entryUserId]
    );


    if (rows.length > 0) {
      return rows[0][0]; 
    } else {
      null
    }
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}


export async function getDocumentApplicationDetailsById(applicationId, entryUserId) {
    try {
      
      const [rows] = await pool.query(
        `CALL sp_getApplicationDocumentDetailsByapplicationId(?, ?)`,
        [applicationId, entryUserId]
      );
  
    console.log("applicationId", applicationId)
    console.log("entryUserId", entryUserId)
    console.log("document", rows)
      if (rows && rows[0].length > 0) {
        return rows[0]; 
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }


export async function getApplicationStatusHistoryById(applicationId, entryUserId) {
    try {
     
      const [rows] = await pool.query(
        `CALL sp_getApplicationStatusHistorybyapplicationId(?, ?)`,
        [applicationId, entryUserId]
      );
      console.log("applicationId", applicationId)
      console.log("entryUserId", entryUserId)
      console.log("document", rows)
   
      if (rows && rows[0].length > 0) {
        return rows[0]; 
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }


  export async function updateEnquiryStatusModel({
    ApplicationID,
    locationIp,
    macAddress,
    deviceId,
    StatusID,
    StatusText,
    Remarks,
    EntryUserID,
  }) {
    try {
     
      const [rows] = await pool.query(
        `CALL sp_updateEnqueryStatusv1(?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode)`,
        [
          ApplicationID,
          locationIp,
          macAddress,
          deviceId,
          StatusID,
          StatusText,
          Remarks,
          EntryUserID,
        ]
      );
  
      const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
      console.log("gsysgh",result)
  return result[0].ErrorCode;
    //   const [result] = await pool.query(`SELECT @ErrorCode AS ErrorCode;`);
    //   const errorCode = result[0]?.ErrorCode ?? null;
  
    //   return {
    //     success: errorCode === 0,
    //     errorCode,
    //     message:
    //       errorCode === 0
    //         ? "Enquiry status updated successfully."
    //         : "Failed to update enquiry status.",
    //   };
    } catch (error) {
      console.error("Error updating enquiry status:", error.message);
      throw new Error("Database error: " + error.message);
    }
  }

  