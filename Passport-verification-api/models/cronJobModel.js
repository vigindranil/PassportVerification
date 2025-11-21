import pool from "../db.js";

export async function autoOCApprovallUpdate() {
  try {
    const [result] = await pool.query(`CALL sp_autoOCApprovallUpdate()`);

    // You don't need a second SELECT since your procedure ends with SELECT ErrorCode
    const [[{ ErrorCode: errorCode }]] = result;

    return errorCode;
  } catch (error) {
    console.error("Error saving transaction:", error.message);
    throw new Error("Database error: " + error.message);
  }
}

export async function updateDocumentarchiveStatus(DocumentId) {
  try {
    console.log("log", DocumentId);
    
    const [rows] = await pool.query(`CALL sp_UpdateDocumentarchiveStatus(?, @ErrorCode)`, [DocumentId]);

    const [result] = await pool.query("SELECT @ErrorCode AS ErrorCode;");
    console.log(result[0].ErrorCode);
    
    return result[0].ErrorCode;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

export async function getDocumentdoneBySP(
  StartDate, EndDate
) {
  try {
    const [rows] = await pool.query(
      `CALL sp_getDocumentdoneBySP(?, ?)`,
      [StartDate, EndDate]
    );

    if (rows.length > 0) {
      console.log(rows[0]);
      
      return rows[0];
    } else {
      null;
    }
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}


export async function getApplicationCountallDsistrict() {
  try {
    const [rows] = await pool.query(
      `CALL sp_getApplicationCountallDsistrict(?, ?, ?)`,
      [1, null, null]
    );

    if (rows.length > 0) {
      console.log(rows[0]);
      
      return rows[0];
    } else {
      null;
    }
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}