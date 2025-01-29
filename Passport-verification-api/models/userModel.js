import pool from '../db.js';



export async function saveUserRegistrationModel(
  UserID,
  UserName,
  FullName ,
  UserPassword,
  Firstname,
  LastName,
  MobileNo,
  EmailID,
  Gender,
  AADHAARNo,
  Designation,
  UserRoleID,
  DistrictID,
  PSID,
  EntryUserID
 

) {
  const [rows] = await pool.query(
    "CALL sp_saveUserRegistrationv2(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, @ErrorCode, @ID);",
    [
      UserID,
      UserName,
      FullName,
      UserPassword,
      Firstname,
      LastName,
      MobileNo,
      EmailID,
      Gender,
      AADHAARNo,
      Designation,
      UserRoleID,
      DistrictID,
      PSID,
      EntryUserID,
      FullName
    ]
  );

  const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
  return result[0].ErrorCode;

}



export async function updateUserActivationStatusModel(
  UserID,
  ActivationStatus,
) {
  const [rows] = await pool.query(
    "CALL sp_updateUserActivationStatus(?, ?, @ErrorCode);",
    [
      UserID,
      ActivationStatus,
    ]
  );

  const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
  console.log("error code", result[0].ErrorCode);
  
  return result[0].ErrorCode;

}



export async function showuserDetailsModel(
  EntryUserID
) {
  try {
    const [rows] = await pool.query('CALL sp_showuserDetails(?)', [EntryUserID]);
    console.log(rows);
    
    return rows;
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}




export async function getApplicationStatusModel(
  EntryUserID, Status, Periord 
) {
  try {
    const [rows] = await pool.query('CALL sp_getapplicationstatusv2(?,?,?)', [EntryUserID,Status, Periord ]);
    console.log(rows);
    return rows;
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}



export async function getApplicationCountsv1Model(
  EntryUserID
) {
  try {
    console.log(EntryUserID);
    
    const [rows] = await pool.query('CALL GetApplicationCountsv1(?)', [EntryUserID]);
    console.log("GetApplicationCountsv1", rows);
    
    return rows;
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}


