import pool from "../db.js";

export async function logoutModel(
    UserID,
    JWTToken,
    AADHAARToken
) {
    const [rows] = await pool.query(
        "CALL sp_updateAADHAARToken(?, ?, ?, @ErrorCode);",
        [
            UserID,
            JWTToken,
            AADHAARToken
        ]
    );

    return await pool.query("SELECT @ErrorCode AS ErrorCode;");

}