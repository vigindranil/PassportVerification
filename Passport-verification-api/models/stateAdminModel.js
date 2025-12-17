import pool from "../db.js";

export async function getDashboardCountStateMasterAdminModel(
    userId
) {
    try {
        const [rows] = await pool.query(
            `CALL sp_getDashboardCountStateMasterAdmin(?)`,
            [userId]
        );

        if (rows.length > 0) {
            return [rows][0][0];
        } else {
            null;
        }
    } catch (error) {
        throw new Error("Database error: " + error.message);
    }
}

export async function getDistrictwiseApplicationCountModel(
    statusId,
    userId
) {
    try {
        const [rows] = await pool.query(
            `CALL sp_getDistrictwiseApplicationCount(?,?)`,
            [statusId, userId]
        );

        if (rows.length > 0) {
            return [rows][0];
        } else {
            null;
        }
    } catch (error) {
        throw new Error("Database error: " + error.message);
    }
}

export async function getPoliceStationtwiseApplicationCountModel(
    statusId,
    districtId,
    userId
) {
    try {
        const [rows] = await pool.query(
            `CALL sp_getPoliceStationtwiseApplicationCount(?,?,?)`,
            [statusId, districtId, userId]
        )

        if (rows.length > 0) {
            return [rows][0];
        } else {
            null;
        }
    } catch (error) {
        throw new Error("Database error: " + error.message);
    }
}

export async function getApplicationTimeLineModel(
    userId,
    districtId,
    psId,
    startdate,
    enddate
) {
    try {
        const [rows] = await pool.query(
            `CALL sp_getApplicationTimeLine(?,?,?,?,?)`,
            [userId, districtId, psId, startdate, enddate]
        );

        if (rows.length > 0) {
            return [rows][0];
        } else {
            null;
        }
    } catch (error) {
        throw new Error("Database error: " + error.message);
    }
}

export async function getApplicationStatusByFileNumberModel(ApplicationId,) {
    try {
        const [rows] = await pool.query(
            `CALL sp_getApplicationTrack(?)`,
            [ApplicationId]
        )

        if (rows.length > 0) {
            return [rows][0];
        } else {
            null;
        }
    } catch (error) {
        throw new Error("Database error: " + error.message);
    }
}


export async function showDistrictNodalModel(
  EntryUserID
) {
  try {
    const [rows] = await pool.query('CALL sp_showDistrictNodal(?)', [EntryUserID]);
    // console.log(rows);
    
    return rows;
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}


