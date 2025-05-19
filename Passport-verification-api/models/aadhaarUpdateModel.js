import pool from "../db.js";

export async function getUserAADHARInfoModel(startindex, endIndex) {
  try {
    const [rows] = await pool.query(`CALL sp_getUserAADHARInfo(?, ?)`, [
      startindex,
      endIndex,
    ]);

    console.log(rows[0]);

    return rows[0];
  } catch (error) {
    return null;
  }
}

export async function updateAadharNumber(UserId, AadhaarNumber) {
  try {
    const [result] = await pool.query(
      `CALL sp_updateaadharNumber(?, ?, @ErrorCode)`,
      [UserId, AadhaarNumber]
    );

    const [[{ ErrorCode: errorCode }]] = await pool.query(
      `SELECT @ErrorCode AS ErrorCode`
    );
    // console.log("model result",result?.affectedRows);
    // console.log("model errorCode", errorCode);

    if (result?.affectedRows) {
      return true;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error saving transaction:", error.message);
    throw new Error("Database error: " + error.message);
  }
}
