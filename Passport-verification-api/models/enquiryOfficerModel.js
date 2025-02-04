import pool from "../db.js";

export async function getSpecialEnquiryOfficersModel(
    EntryUserId
) {
    try {
        const [rows] = await pool.query("CALL sp_getSpecialEnquiryofficersDetails(?);", [
            EntryUserId,
        ]);
        console.log("rows", rows);

        return rows[0];
    } catch (error) {
        console.log("error", error);
        throw new Error("Database error: " + error.message);
    }
}









export async function assignApplicationToSEModel(
    applicationId,
    assignTo,
    macAddress,
    locationIp,
    deviceId,
    EntryuserId
) {
    try {
        // Call the stored procedure with input parameters
        const [rows] = await pool.query(
            `CALL sp_saveapplicationassigntoSE(
          ?, ?, ?, ?, ?, ?, @ErrorCode
        );`,
            [
                applicationId,
                assignTo,
                macAddress,
                locationIp,
                deviceId,
                EntryuserId

            ]
        );

        // Fetch the `@ErrorCode` output parameter
        const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
        console.log("result", result);
        
        return result[0].ErrorCode;
    } catch (error) {
        console.error("Error calling sp_saveApplicationDetails:", error);
        throw error;
    }
}





export async function getStatusbySEModal(
    userId,
    status,
    period
  ) {
    try {
        console.log("userId",userId)
        console.log("status",status)
        console.log("period",period)
      const [rows] = await pool.query('CALL sp_getStatusbySE(?, ?, ?);',
        [
            userId,
            status,
            period
        ]
      );
      console.log("getApplicationStatus", rows);
      
      return rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }