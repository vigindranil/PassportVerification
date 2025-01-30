import pool from '../db.js';


export async function saveDocumentUploadModel(ApplicationId, DocumentPath, DocumentRemarks ,DocumentTypeId,IdNumber , DeviceId, MacAddress, longitude, latitude, locationIp, EntryuserId) {
  try {
    const jsonTEXT = "{}";
    const [rows] = await pool.query(
      'CALL sp_saveDocumentUpload(?, ?, ?,?, ?, ?,?,?,?,?,?,?, @DocId ,@Errorcode);',
      [ApplicationId, DocumentPath,DocumentRemarks , DocumentTypeId,IdNumber , DeviceId, MacAddress, longitude, latitude, locationIp,jsonTEXT,  EntryuserId]
    );
    const [result] = await pool.query('SELECT @Errorcode AS Errorcode, @DocId As DocId;');
    console.log("save", result[0]);
    return result[0].Errorcode;
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}


export async function getDocumentUploadDetailsModel(ApplicationId, EntryUserId) {
  try {
    const [rows] = await pool.query(
      'CALL sp_getDocumentUploadDetails(?, ?);',
      [ApplicationId, EntryUserId]
    );

    return rows[0];
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}



export async function saveCaseAssignModel(
  applicationId,
  citizentype,
  jsonTEXT,
  filepath,
  macAddress,
  locationIp,
  deviceId,
  EntryuserId
) {
  try {


    const [rows] = await pool.query(
      'CALL sp_saveapplicationassign( ?, ?, ?, ?, ?, ?, ?,?, @application_Id, @ErrorCode);',
      [
        applicationId,
        citizentype,
        jsonTEXT,
        filepath,
        macAddress,
        locationIp,
        deviceId,
        EntryuserId
      ]
    );

console.log('applicationId', applicationId);
console.log('citizentype', citizentype);
console.log('DocTypeId', DocTypeId);
console.log('filepath', filepath);
console.log('macAddress', macAddress);
console.log('locationIp', locationIp);
console.log('deviceId', deviceId);
console.log('EntryuserId', EntryuserId);

    const [result] = await pool.query('SELECT @application_Id AS application_Id, @ErrorCode AS ErrorCode;');
    console.log("save", result[0]);
    return result[0].ErrorCode;
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}