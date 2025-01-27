import pool from '../db.js';



export async function getApplicationDetailsByApplicationId(applicationId, entryUserId) {
  try {
    const [rows] = await pool.query(
      `CALL sp_getApplicationDetailsByapplicationId(?, ?)`,
      [applicationId, entryUserId]
    );


    if (rows.length > 0) {
      return rows[0][0]; 
    } else {
      null
    }
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}


export async function getDocumentApplicationDetailsById(applicationId, entryUserId) {
    try {
      
      const [rows] = await pool.query(
        `CALL sp_getApplicationDocumentDetailsByapplicationId(?, ?)`,
        [applicationId, entryUserId]
      );
  
    console.log("applicationId", applicationId)
    console.log("entryUserId", entryUserId)
    console.log("document", rows)
      if (rows && rows[0].length > 0) {
        return rows[0]; 
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }


  export async function getApplicationStatusHistoryById(applicationId, entryUserId) {
    try {
     
      const [rows] = await pool.query(
        `CALL sp_getApplicationStatusHistorybyapplicationId(?, ?)`,
        [applicationId, entryUserId]
      );
      console.log("applicationId", applicationId)
      console.log("entryUserId", entryUserId)
      console.log("document", rows)
   
      if (rows && rows[0].length > 0) {
        return rows[0]; 
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }