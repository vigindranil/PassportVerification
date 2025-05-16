import pool from '../db.js';

export async function saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, applicationId, OperationName, json, EntryUserID) {
  try {

    const ErrorCode = 0;


    const [result] = await pool.query(
      `CALL sp_savetransaction(?, ?, ?, ?, ?, ?, ?, ?,@ErrorCode)`,
      [ipaddress, macAddress, Longitude, Latitude, applicationId, OperationName, json, EntryUserID]
    );


    const [[{ ErrorCode: errorCode }]] = await pool.query(`SELECT @ErrorCode AS ErrorCode`);

    console.log('sp_savetransaction', result);

    if (errorCode === 0) {
      return true;
    } else {
      null
    }
  } catch (error) {
    console.error('Error saving transaction:', error.message);
    throw new Error('Database error: ' + error.message);
  }
}

export async function saveCriminalStatusLog(SearchTypeName, SearchedName, ApiRequest="", UserId) {
  try {

    const [result] = await pool.query(
      `CALL sp_SaveCriminalStatusLog(?, ?, ?, ?, @ErrorCode)`,
      [SearchTypeName, SearchedName, ApiRequest, UserId]
    );

    const [[{ ErrorCode: errorCode }]] = await pool.query(`SELECT @ErrorCode AS ErrorCode`);

    if (errorCode === 0) {
      return true;
    } else {
      null
    }
  } catch (error) {
    console.error('Error saving transaction:', error.message);
    throw new Error('Database error: ' + error.message);
  }
}