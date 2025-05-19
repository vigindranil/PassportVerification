
import pool from '../db.js';

export async function saveDocumentUploadModel(
  DocDetailsID,
  ApplicationId,
  DocumentPath,
  DocumentRemarks,
  DocumentTypeId,
  IdNumber="",
  IdNumber2="",
  IdNumber3="",
  IdNumber4="",
  IdNumber5="",
  DeviceId,
  MacAddress,
  longitude,
  latitude,
  locationIp,
  appDocId,
  EntryuserId
) {
  try {

    const jsonTEXT = "{}";
    // console.log("DocDetailsID", DocDetailsID)
    // console.log("ApplicationId", ApplicationId)
    // console.log("DocumentPath", DocumentPath)
    // console.log("DocumentRemarks", DocumentRemarks)
    // console.log("DocumentTypeId", DocumentTypeId)
    // console.log("IdNumber", IdNumber)
    // console.log("IdNumber2", IdNumber2)
    // console.log("IdNumber3", IdNumber3)
    // console.log("IdNumber4", IdNumber4)
    // console.log("IdNumber5", IdNumber5)
    // console.log("DeviceId", DeviceId)
    // console.log("MacAddress", MacAddress)
    // console.log("longitude", longitude)
    // console.log("latitude", latitude)
    // console.log("locationIp", locationIp)
    // console.log("jsonTEXT", jsonTEXT)
    // console.log("appDocId", appDocId)
    // console.log("EntryuserId", EntryuserId)
    const [rows] = await pool.query(
      "CALL sp_saveDocumentUpload(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, @DocId ,@Errorcode);",
      [
        DocDetailsID,
        ApplicationId,
        DocumentPath,
        DocumentRemarks,
        DocumentTypeId,
        IdNumber,
        IdNumber2,
        IdNumber3,
        IdNumber4,
        IdNumber5,
        DeviceId,
        MacAddress,
        longitude,
        latitude,
        locationIp,
        jsonTEXT,
        appDocId,
        EntryuserId,
      ]
    );
    const [result] = await pool.query(
      "SELECT @Errorcode AS Errorcode, @DocId As DocId;"
    );
    // console.log("save", result[0]);
    return result[0].Errorcode;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

export async function getDocumentUploadDetailsModel(
  ApplicationId,
  EntryUserId
) {
  try {
    const [rows] = await pool.query("CALL sp_getDocumentUploadDetails(?, ?);", [
      ApplicationId,
      EntryUserId,
    ]);

    return rows[0];
  } catch (error) {
    throw new Error("Database error: " + error.message);
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
      "CALL sp_saveapplicationassign( ?, ?, ?, ?, ?, ?, ?,?,@application_Id, @ErrorCode);",
      [
        applicationId,
        citizentype,
        jsonTEXT,
        filepath,
        macAddress,
        locationIp,
        deviceId,
        EntryuserId,
      ]
    );

    const [result] = await pool.query(
      "SELECT @application_Id AS application_Id, @ErrorCode AS ErrorCode;"
    );
    // console.log("applicationId", applicationId);
    // console.log("save", result[0]);
    return result[0].ErrorCode;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}



export async function getStatusByEOModel(
  userId ,
  status,
  period,
) {
  try {
    const [rows] = await pool.query("CALL sp_getStatusbyEOv1(?,?,?);", 
      [
      userId,
      status,
      period,
    ]
  );
  
  // console.log(rows);
    return rows[0];
    
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}



export async function getCountEOModel(
  userId ,
) {
  try {
    const [rows] = await pool.query("CALL sp_getCountEO(?);", 
      [
      userId,
    ]
  );
  
  // console.log(rows);
    return rows[0];
    
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}