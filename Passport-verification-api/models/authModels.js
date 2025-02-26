import pool from "../db.js";

export async function getUserLoginModel(username, password) {
  try {
    const [rows] = await pool.query("CALL sp_getUserLoginDetails(?, ?)", [
      username,
      password,
    ]);
    return rows[0];
  } catch (error) {
    console.log(error.message);
    return null;
  } finally {
    // await pool.end(); // Close the pool after execution
    console.log("Connection closed");
  }
}

export async function updateAuthToken(UserID, JWTToken, AADHAARToken) {
  const [rows] = await pool.query(
    "CALL sp_updateAADHAARToken(?, ?, ?, @ErrorCode);",
    [UserID, JWTToken, AADHAARToken]
  );
  return await pool.query("SELECT @ErrorCode AS ErrorCode;");
}

export async function getUserVerifyToken(UserID) {
  try {
    const [rows] = await pool.query("CALL sp_getUserVerifyToken(?)", [UserID]);
    return rows[0];
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

export async function genearateOtp(username, password) {
  const [rows] = await pool.query(
    "CALL sp_genearateotp(?, ?, @p_otp ,@ErrorCode);",
    [username, password]
  );
  return await pool.query("SELECT @p_otp AS OTP, @ErrorCode AS ErrorCode;");
}
