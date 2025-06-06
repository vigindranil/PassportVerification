import pool from "../db.js";

// get user aadhaar info
export async function getUserAADHARInfoModel(startindex, endIndex) {
  try {
    const [rows] = await pool.query(`CALL sp_getUserAADHARInfo(?, ?)`, [
      startindex,
      endIndex,
    ]);

    console.log(rows[0]);

    return rows[0];
  } catch (error) {
    return null;
  }
}

// update user aadhaar number
export async function updateAadharNumber(UserId, AadhaarNumber) {
  try {
    const [result] = await pool.query(
      `CALL sp_updateaadharNumber(?, ?, @ErrorCode)`,
      [UserId, AadhaarNumber]
    );

    const [[{ ErrorCode: errorCode }]] = await pool.query(
      `SELECT @ErrorCode AS ErrorCode`
    );
    if (result?.affectedRows) {
      return true;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error saving transaction:", error.message);
    throw new Error("Database error: " + error.message);
  }
}

// get applicant aadhaar info
export async function getApplicantAADHARInfoModel(startindex, endIndex) {
  try {
    const [rows] = await pool.query(`CALL sp_getApplicantAADHARInfo(?, ?)`, [
      startindex,
      endIndex,
    ]);
    return rows[0];
  } catch (error) {
    return null;
  }
}

// update applicant aadhaar number
export async function updateApplicantAAdharNumber(appId, AadhaarNumber) {
  try {
    const [result] = await pool.query(
      `CALL sp_updateApplicantAAdharNumber(?, ?, @ErrorCode)`,
      [appId, AadhaarNumber]
    );
    const [[{ ErrorCode: errorCode }]] = await pool.query(
      `SELECT @ErrorCode AS ErrorCode`
    );
    console.log("result", result);
    if (result?.affectedRows) {
      return true;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error saving transaction:", error.message);
    throw new Error("Database error: " + error.message);
  }
}




