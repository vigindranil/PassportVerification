import pool from '../db.js';


export async function getPoliceStationsByDistrictModel(districtId) {
    try {
      const [rows] = await pool.query('CALL GetPoliceStationsByDistrict(?)', [districtId]);
      return rows[0]; 
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }
  



/**
 * Fetch all districts
 * @returns {Promise<object[]>} List of districts
 */
export async function showDistrictModel() {
  try {
    const [rows] = await pool.query('CALL showDistrict()');
    return rows[0]; // Assuming the procedure returns a single result set
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}
