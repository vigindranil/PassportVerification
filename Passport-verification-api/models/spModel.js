import pool from "../db.js";


export async function transferapplicationModel(
    applicationId ,
    locationIp ,
    deviceId ,
    remarks ,
    districtId ,
    psId ,
    macAddress ,
    EntryUserID
  ) {
    try {
      const [rows] = await pool.query(
        `CALL sp_transferapplication(?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode)`,
        [
          applicationId,
          locationIp,
          deviceId,
          remarks,
          districtId,
          psId,
          macAddress,
          EntryUserID
        ]
      );
  
      console.log('ApplicationID', applicationId);
      console.log('locationIp', locationIp);
      console.log('deviceId', deviceId);
      console.log('remarks', remarks);
      console.log('districtId', districtId);
      console.log('psId', psId);
      console.log('macAddress', macAddress);
      console.log('EntryUserID', EntryUserID);
  
      const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
      console.log("transferapplication", result[0].ErrorCode);
      return result[0].ErrorCode;
    } catch (error) {
      console.error("Error updating enquiry status:", error.message);
      throw new Error("Database error: " + error.message);
    }
  }
 
  


 
    