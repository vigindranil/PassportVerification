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
  console.log('UserID:',UserID)
  console.log('UserName:',UserName)
  console.log('FullName:',FullName)
  console.log('UserPassword:',UserPassword)
  console.log('Firstname:',Firstname)
  console.log('LastName:',LastName)
  console.log('MobileNo:',MobileNo)
  console.log('EmailID:',EmailID)
  console.log('Gender:',Gender)
  console.log('AADHAARNo:',AADHAARNo)
  console.log('Designation:',Designation)
  console.log('UserRoleID:',UserRoleID)
  console.log('DistrictID:',DistrictID)
  console.log('PSID:',PSID)
  console.log('EntryUserID:',EntryUserID)
  
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
      EntryUserID
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
    const [rows] = await pool.query('CALL sp_getApplicationCount(?)', [EntryUserID]);
    console.log("GetApplicationCountsv1", rows);
    
    return rows;
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}


