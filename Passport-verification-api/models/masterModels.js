import pool from '../db.js';


export async function getPoliceStationsByDistrictModel(districtId) {
    try {
      const [rows] = await pool.query('CALL GetPoliceStationsByDistrict(?)', [districtId]);
      return rows[0]; 
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }
  