import pool from '../db.js';

export async function saveApplicationDetailsModel(
  DPHqID,
  psName,
  fileNumber,
  PVRequestID,
  applicant_name,
  gender,
  dob,
  place_birth,
  spouse_name,
  father_name,
  PVInitiationDate,
  PVRequeststatus,
  PVStatusDate,
  verificationAddress,
  permanentAddress,
  PVsequenceNO,
  emailId,
  phonenumber,
  EntryUserID
) {
  try {
    // Call the stored procedure with input parameters
    const [rows] = await pool.query(
      `CALL sp_saveApplicationDetails(
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode
      );`,
      [
        DPHqID,
        psName,
        fileNumber,
        PVRequestID,
        applicant_name,
        gender,
        dob,
        place_birth,
        spouse_name,
        father_name,
        PVInitiationDate,
        PVRequeststatus,
        PVStatusDate,
        verificationAddress,
        permanentAddress,
        PVsequenceNO,
        emailId,
        phonenumber,
        EntryUserID
      ]
    );

    // Fetch the `@ErrorCode` output parameter
    const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
    return result[0].ErrorCode;
  } catch (error) {
    console.error("Error calling sp_saveApplicationDetails:", error);
    throw error;
  } 
  // finally { 
  //   // Close the database connection
  //   pool.end();
  // }
}
