import pool from "../db.js";

export async function getUserLoginModel(username, password) {
    try {
        const [rows] = await pool.query('CALL sp_getUserLoginDetails(?, ?)', [username, password]);
        return rows[0];
    } catch (error) {
        console.log(error.message);
        return null;
    } finally {
        // await pool.end(); // Close the pool after execution
        console.log("Connection closed");
    }
};

export async function updateAuthToken(
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

    const error_code = await pool.query("SELECT @ErrorCode AS ErrorCode;");
    console.log("error_code", error_code);

    return error_code;

}


export async function getUserVerifyToken(UserID) {
    try {
        console.log("UserID",UserID);
        
        const [rows] = await pool.query('CALL sp_getUserVerifyToken(?)', [UserID]);
        console.log("rows",rows);
        return rows[0];
    } catch (error) {
        throw new Error('Database error: ' + error.message);
    }
};