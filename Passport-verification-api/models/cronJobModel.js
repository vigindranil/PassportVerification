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
