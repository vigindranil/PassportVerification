import pool from "../db.js";

export async function getApplicationDetailsByApplicationId(
  applicationId,
  entryUserId
) {
  try {
    const [rows] = await pool.query(
      `CALL sp_getApplicationDetailsByapplicationId(?, ?)`,
      [applicationId, entryUserId]
    );

    if (rows.length > 0) {
      return rows[0][0];
    } else {
      null;
    }
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

export async function getDocumentApplicationDetailsById(
  applicationId,
  entryUserId
) {
  try {
    const [rows] = await pool.query(
      `CALL sp_getApplicationDocumentDetailsByapplicationId(?, ?)`,
      [applicationId, entryUserId]
    );

    console.log("applicationId", applicationId);
    console.log("entryUserId", entryUserId);
    console.log("document", rows);
    if (rows && rows[0].length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function getApplicationStatusHistoryById(
  applicationId,
  entryUserId
) {
  try {
    const [rows] = await pool.query(
      `CALL sp_getApplicationStatusHistorybyapplicationId(?, ?)`,
      [applicationId, entryUserId]
    );
    console.log("applicationId", applicationId);
    console.log("entryUserId", entryUserId);
    console.log("document", rows);

    if (rows && rows[0].length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function updateEnquiryStatusModel(
  ApplicationID,
  locationIp,
  macAddress,
  deviceId,
  StatusID,
  StatusText,
  Remarks,
  EntryUserID
) {
  try {
    const [rows] = await pool.query(
      `CALL sp_updateEnqueryStatusv2(?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode)`,
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

    console.log('ApplicationID', ApplicationID);
    console.log('locationIp', locationIp);
    console.log('macAddress', macAddress);
    console.log('deviceId', deviceId);
    console.log('StatusID', StatusID);
    console.log('StatusText', StatusText);
    console.log('Remarks', Remarks);
    console.log('EntryUserID', EntryUserID);

    const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
    console.log("updateEnqueryStatusv2", result[0].ErrorCode);
    return result[0].ErrorCode;
  } catch (error) {
    console.error("Error updating enquiry status:", error.message);
    throw new Error("Database error: " + error.message);
  }
}

export async function updateAADHAARInfoModel(
  ApplicationID,
  AadharNumber,
  AadhaarName,
  AadhaarDOB,
  AadharVerifiedStatus,
  AadhaarFatherName,
  AadhaarGender,
  AadhaarAddress,
  EntryUserID,
) {
  try {
    const [rows] = await pool.query(
      `CALL sp_updateAADHAARInfoV1(?,?,?, ?, ?, ?, ?, ?, ?, @ErrorCode)`,
      [
        ApplicationID,
        btoa(AadharNumber),
        AadhaarName,
        AadhaarDOB,
        AadharVerifiedStatus,
        AadhaarFatherName,
        AadhaarGender,
        AadhaarAddress,
        EntryUserID,
      ]
    );

    const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
    console.log("aadhaar update", result[0].ErrorCode);
    return result[0].ErrorCode;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

export async function updateAADHAARInfoModelV2(
  ApplicationID,
  AadharNumber,
  AadhaarName,
  AadhaarDOB,
  AadharVerifiedStatus,
  AadhaarFatherName,
  AadhaarGender,
  AadhaarAddress,
  AadharRemarks,
  EntryUserID,
) {
  try {
    const [rows] = await pool.query(
      `CALL sp_updateAADHAARInfo_V2(?,?,?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode)`,
      [
        ApplicationID,
        btoa(AadharNumber),
        AadhaarName,
        AadhaarDOB,
        AadharVerifiedStatus,
        AadhaarFatherName,
        AadhaarGender,
        AadhaarAddress,
        AadharRemarks,
        EntryUserID,
      ]
    );

    const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
    console.log("aadhaar update", result[0].ErrorCode);
    return result[0].ErrorCode;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

export async function setExternelApiLog(
  APITypeId,
  ApplicationId,
  APIName,
  APIRequest,
  APIResponse,
  EntryUserID,
  Remarks
) {
  try {
    const [rows] = await pool.query(
      `CALL sp_setExternelApiLog(?, ?, ?, ?, ?, ?, ?, @ErrorCode)`,
      [
        APITypeId,
        ApplicationId,
        APIName,
        APIRequest,
        APIResponse,
        EntryUserID,
        Remarks,
      ]
    );

    const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
    return result[0].ErrorCode;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

export async function savethirdpartyVerifyStatus(
  ApplicationId,
  DocumentID,
  VerifyStatus,
  ApiResponse,
  EntryuserId
) {
  try {
    const [rows] = await pool.query(
      `CALL sp_savethirdpartyVerifyStatus(?, ?, ?, ?, ?, @ErrorCode)`,
      [ApplicationId, DocumentID, VerifyStatus, ApiResponse, EntryuserId]
    );

    console.log('sp_savethirdpartyVerifyStatus');
    console.log('ApplicationId', ApplicationId);
    console.log('DocumentID', DocumentID);
    console.log('VerifyStatus', VerifyStatus);
    console.log('ApiResponse', ApiResponse);
    console.log('EntryuserId', EntryuserId);
    
    const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
    console.log('ErrorCode', result[0].ErrorCode);
    return result[0].ErrorCode;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}


export async function getAadharDetailsByapplicationIdModel(
  ApplicationId ,
  EntryuserId 
) {
  try {
      console.log("userId",ApplicationId )
      console.log("status",EntryuserId )
      
    const [rows] = await pool.query('CALL sp_getAadharDetailsByapplicationId(?,?);',
      [
        ApplicationId,
        EntryuserId
      ]
    );
    console.log("getApplicationStatus", rows);
    
    return rows[0];
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}



export async function getApplicationCountMasterAdminModel(
  userId,
  districtId,
  startDate,
  endDate
) {
  try {
    const [rows] = await pool.query(
      `CALL sp_getApplicationCountmasteradmin(?,?,?,?)`,
      [userId, districtId, startDate, endDate]
    );

    if (rows.length > 0) {
      return [rows][0]; // First result set
    } else {
      return [];
    }
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}






