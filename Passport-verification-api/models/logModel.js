import pool from '../db.js';

export async function saveTransactionHistory(ipaddress, macAddress, Longitude, Latitude, applicationId, OperationName, json, EntryUserID) {
  try {

    const ErrorCode = 0;


    const [result] = await pool.query(
      `CALL sp_savetransaction(?, ?, ?, ?, ?, ?, ?, ?,@ErrorCode)`,
      [ipaddress, macAddress, Longitude, Latitude, applicationId, OperationName, json, EntryUserID]
    );


    const [[{ ErrorCode: errorCode }]] = await pool.query(`SELECT @ErrorCode AS ErrorCode`);

    // console.log('sp_savetransaction', result);

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

export async function saveCriminalStatusLog(SearchTypeName, SearchedName, UserId) {
  try {

    const [result] = await pool.query(
      `CALL sp_SaveCriminalStatusLog(?, ?, ?, ?, @ErrorCode)`,
      [SearchTypeName, SearchedName, '{"SearchedName": "SearchedName"}', UserId]
    );

    const [[{ ErrorCode: errorCode }]] = await pool.query(`SELECT @ErrorCode AS ErrorCode`);

    console.log(`payload`, {SearchTypeName, SearchedName, ApiRequest: '{"SearchedName": "SearchedName"}', UserId});
    console.log(`saveCriminalStatusLog (${SearchTypeName})`, errorCode);
    
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