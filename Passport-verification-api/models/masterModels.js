import pool from '../db.js';


export async function getPoliceStationsByDistrictModel(districtId) {
    try {
      console.log("districtId",districtId);
      
      const [rows] = await pool.query('CALL sp_getPoliceStationsByDistrict(?)', [districtId]);
      console.log("rows",rows);
      return rows[0]; 
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }
  




export async function showDistrictModel() {
  try {
    const [rows] = await pool.query('CALL sp_getDistrict()');
    return rows[0]; 
  } catch (error) {
    throw new Error('Database error: ' + error.message);
  }
}


export async function showDesignationModel() {
    try {
      const [rows] = await pool.query('CALL sp_getDesgination();');
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

  export async function showDocumentDetailsbyCitizenTypeModel(citizenType) {
    try {

      const [rows] = await pool.query(`CALL sp_showDocumentDetailsbyCitizenType(?)`, [citizenType]);
  
 
      return rows[0]; 
    } catch (error) {
      console.error('Error fetching document subtypes:', error.message);
      throw new Error('Database error: ' + error.message);
    }
  }

  export async function showSubDocumentbyCitizenTypeModel(citizensubType) {
    try {
      
      const [rows] = await pool.query(`CALL sp_showSubDocumentbyCitizenType(?, ?)`, [citizensubType, citizensubType]);
  
 
      return rows[0]; 
    } catch (error) {
      console.error('Error fetching document subtypes:', error.message);
      throw new Error('Database error: ' + error.message);
    }
  }