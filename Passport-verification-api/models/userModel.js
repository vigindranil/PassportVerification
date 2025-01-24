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
  return result[0].ErrorCode;

}



export async function getDistrictNodalDashBoardModel(
  EntryUserID
) {
  try {
    const [rows] = await pool.query('CALL sp_getDistrictNodalDashBoard(?)', [EntryUserID]);
    console.log(rows);
    
    return rows[0];
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
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
  EntryUserID, Status
) {
  try {
    const [rows] = await pool.query('CALL sp_getapplicationstatus(?,?)', [EntryUserID,Status ]);
    return rows;
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}



export async function getApplicationCountsv1Model(
  EntryUserID
) {
  try {
    const [rows] = await pool.query('CALL GetApplicationCountsv1(?)', [EntryUserID]);
    console.log(rows);
    
    return rows;
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}
