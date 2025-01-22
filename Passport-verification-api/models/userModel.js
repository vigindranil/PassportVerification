import pool from '../db.js';



export async function saveUserRegistrationModel(
  UserID,
  UserName,
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
    "CALL sp_saveUserRegistration(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @ErrorCode);",
    [
      UserID,
      UserName,
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
    ]
  );

  return await pool.query("SELECT @ErrorCode AS ErrorCode;");

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

  return await pool.query("SELECT @ErrorCode AS ErrorCode;");

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


