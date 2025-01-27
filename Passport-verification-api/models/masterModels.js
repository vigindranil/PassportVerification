import pool from '../db.js';


export async function getPoliceStationsByDistrictModel(districtId) {
    try {
      const [rows] = await pool.query('CALL GetPoliceStationsByDistrict(?)', [districtId]);
      return rows[0]; 
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }
  




export async function showDistrictModel() {
  try {
    const [rows] = await pool.query('CALL showDistrict()');
    return rows[0]; 
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}


export async function showDesignationModel() {
    try {
      const [rows] = await pool.query('CALL showDesgination();');
      return rows[0]; 
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }



  export async function getDocumentsByCitizenTypeModel(citizenTypeId) {
    try {
  
      const [rows] = await pool.query(`CALL GetDocumentByCitizenType(?)`, [citizenTypeId]);
  
      
      return rows[0]; 
    } catch (error) {
      console.error('Error fetching documents by citizen type:', error.message);
      throw new Error('Database error: ' + error.message);
    }
  }


  export async function getCitizenTypesModel() {
    try {
     
      const [rows] = await pool.query(`CALL sp_showCitizenType()`);
  
     
      return rows[0]; 
    } catch (error) {
      console.error('Error fetching citizen types:', error.message);
      throw new Error('Database error: ' + error.message);
    }
  }




  export async function getDocumentSubTypesByIdModel(CitizenId, DocId) {
    try {

      const [rows] = await pool.query(`CALL sp_getDocSubTypeById(?, ?)`, [CitizenId, DocId]);
  
 
      return rows[0]; 
    } catch (error) {
      console.error('Error fetching document subtypes:', error.message);
      throw new Error('Database error: ' + error.message);
    }
  }


  export async function getDocumentTypeListModel() {
    try {
   
      const [rows] = await pool.query(`CALL sp_showDocmentTypeList()`);
  
   
      return rows[0]; 
    } catch (error) {
      console.error('Error fetching document type list:', error.message);
      throw new Error('Database error: ' + error.message);
    }
  }