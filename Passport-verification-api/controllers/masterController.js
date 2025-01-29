import { getPoliceStationsByDistrictModel, showDocumentDetailsbyCitizenTypeModel, showSubDocumentbyCitizenTypeModel } from '../models/masterModels.js';
import { showDistrictModel } from '../models/masterModels.js';
import {showDesignationModel} from '../models/masterModels.js';
// import {saveTransactionHistory} from '../models/logModel.js';
import {getDocumentsByCitizenTypeModel} from '../models/masterModels.js';
import {getCitizenTypesModel} from '../models/masterModels.js';
import {getDocumentSubTypesByIdModel} from '../models/masterModels.js';
import {getDocumentTypeListModel} from '../models/masterModels.js';
/**
 * @swagger
 * /getPoliceStationsByDistrict:
 *   post:
 *     summary: Get Police Stations by District
 *     description: Fetches a list of police stations based on the provided district ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtId:
 *                 type: number
 *                 description: The ID of the district to fetch police stations for.
 *             required:
 *               - districtId
 *     responses:
 *       200:
 *         description: Police stations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Police stations fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       stationId:
 *                         type: number
 *                         example: 101
 *                       stationName:
 *                         type: string
 *                         example: "Central Police Station"
 *       400:
 *         description: Bad request (Invalid districtId).
 *       404:
 *         description: No police stations found for the given districtId.
 *       500:
 *         description: Internal server error.
 */
export const getPoliceStationsByDistrict = async (req, res) => {
  try {
    const { districtId } = req.body;

    if (!districtId || isNaN(districtId)) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid districtId',
      });
    }

    const ipaddress = "test";
            const macAddress = "test";
            const Longitude = "test";
            const Latitude = "test";
            const OperationName = "getPoliceStationsByDistrict";
            const json = "{}"
        // const saveTransaction = await saveTransactionHistory(ipaddress , macAddress , Longitude , Latitude , 0 ,OperationName ,json ,EntryUserId)
    const result = await getPoliceStationsByDistrictModel(districtId);

    if (result.length > 0) {
      return res.status(200).json({
        status: 0,
        message: 'Police stations fetched successfully',
        data: result,
      });
    } else {
      return res.status(404).json({
        status: 1,
        message: 'No police stations found for the given districtId',
      });
    }
  } catch (error) {
    console.error('Error fetching police stations:', error);
    return res.status(500).json({
      status: 1,
      message: 'An error occurred while fetching police stations',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /showDistrict:
 *   get:
 *     summary: Show Districts
 *     description: Fetches a list of all districts.
 *     responses:
 *       200:
 *         description: Districts fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Districts fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       districtId:
 *                         type: number
 *                         example: 1
 *                       districtName:
 *                         type: string
 *                         example: "District A"
 *       404:
 *         description: No districts found.
 *       500:
 *         description: Internal server error.
 */
export const showDistrict = async (req, res) => {
  try {
    const ipaddress = "test";
        const macAddress = "test";
        const Longitude = "test";
        const Latitude = "test";
        const OperationName = "showDistrict";
        const json = "{}"
    // const saveTransaction = await saveTransactionHistory(ipaddress , macAddress , Longitude , Latitude , ApplicationId ,OperationName ,json ,EntryUserId)
    const result = await showDistrictModel();

    if (result.length > 0) {
      return res.status(200).json({
        status: 0,
        message: 'Districts fetched successfully',
        data: result,
      });
    } else {
      return res.status(404).json({
        status: 1,
        message: 'No districts found',
      });
    }
  } catch (error) {
    console.error('Error fetching districts:', error);
    return res.status(500).json({
      status: 1,
      message: 'An error occurred while fetching districts',
      error: error.message,
    });
  }
};




export const showDesignation = async (req, res) => {
    try {
      const ipaddress = "test";
        const macAddress = "test";
        const Longitude = "test";
        const Latitude = "test";
        const OperationName = "showDesignation";
        const json = "{}"
    // const saveTransaction = await saveTransactionHistory(ipaddress , macAddress , Longitude , Latitude , ApplicationId ,OperationName ,json ,EntryUserId)
      const result = await showDesignationModel();
  
      if (result.length > 0) {
        return res.status(200).json({
          status: 0,
          message: 'Designations fetched successfully',
          data: result,
        });
      } else {
        return res.status(404).json({
          status: 1,
          message: 'No designations found',
        });
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
      return res.status(500).json({
        status: 1,
        message: 'An error occurred while fetching designations',
        error: error.message,
      });
    }
  };





  export const getDocumentsByCitizenType = async (req, res) => {
    try {
      const { citizenTypeId } = req.body;
  
    
      if (!citizenTypeId || isNaN(citizenTypeId)) {
        return res.status(400).json({
          status: 1,
          message: 'Invalid citizen type ID',
        });
      }
  
     
      const documents = await getDocumentsByCitizenTypeModel(parseInt(citizenTypeId, 10));
  
     
      if (documents.length > 0) {
        return res.status(200).json({
          status: 0,
          message: 'Documents retrieved successfully',
          data: documents,
        });
      } else {
        return res.status(404).json({
          status: 1,
          message: 'No documents found for the given citizen type',
        });
      }
    } catch (error) {
      console.error('Error in getDocumentsByCitizenTypeController:', error.message);
      return res.status(500).json({
        status: 1,
        message: 'An error occurred while fetching documents',
        error: error.message,
      });
    }
  };


  export const getCitizenTypes = async (req, res) => {
    try {
    
      const citizenTypes = await getCitizenTypesModel();
  
    
      if (citizenTypes.length > 0) {
        return res.status(200).json({
          status: 0,
          message: 'Citizen types retrieved successfully',
          data: citizenTypes,
        });
      } else {
        return res.status(404).json({
          status: 1,
          message: 'No citizen types found',
        });
      }
    } catch (error) {
      console.error('Error in getCitizenTypesController:', error.message);
      return res.status(500).json({
        status: 1,
        message: 'An error occurred while fetching citizen types',
        error: error.message,
      });
    }
  };


  export const getDocumentSubTypes = async (req, res) => {
    try {
      const { CitizenId, DocId } = req.body;
  
     
      if (!CitizenId || !DocId) {
        return res.status(400).json({
          status: 1,
          message: 'CitizenId and DocId are required',
        });
      }
  
   
      const documentSubTypes = await getDocumentSubTypesByIdModel(Number(CitizenId), Number(DocId));
  
     
      if (documentSubTypes.length > 0) {
        return res.status(200).json({
          status: 0,
          message: 'Document subtypes retrieved successfully',
          data: documentSubTypes,
        });
      } else {
        return res.status(404).json({
          status: 1,
          message: 'No document subtypes found for the given criteria',
        });
      }
    } catch (error) {
      console.error('Error in getDocumentSubTypesController:', error.message);
      return res.status(500).json({
        status: 1,
        message: 'An error occurred while fetching document subtypes',
        error: error.message,
      });
    }
  };


  export const getDocumentTypeList = async (req, res) => {
    try {
    
      const documentTypeList = await getDocumentTypeListModel();
  
      
      if (documentTypeList.length > 0) {
        return res.status(200).json({
          status: 0,
          message: 'Document type list retrieved successfully',
          data: documentTypeList,
        });
      } else {
        return res.status(404).json({
          status: 1,
          message: 'No document types found',
        });
      }
    } catch (error) {
      console.error('Error in getDocumentTypeListController:', error.message);
      return res.status(500).json({
        status: 1,
        message: 'An error occurred while fetching the document type list',
        error: error.message,
      });
    }
  };

  export const showDocumentDetailsbyCitizenType = async (req, res) => {
    try {
    
      const { citizenType} = req.body;
      const data = await showDocumentDetailsbyCitizenTypeModel(citizenType);
      
      if (data?.length > 0) {
        return res.status(200).json({
          status: 0,
          message: 'Document type list retrieved successfully',
          data: data,
        });
      } else {
        return res.status(200).json({
          status: 1,
          message: 'No document types found',
          data: []
        });
      }
    } catch (error) {
      console.error('Error in getDocumentTypeListController:', error.message);
      return res.status(500).json({
        status: 1,
        message: 'An error occurred while fetching the document type list',
        error: error.message,
      });
    }
  };

  export const showSubDocumentbyCitizenType = async (req, res) => {
    try {
    
      const { citizensubType } = req.body;
      const data = await showSubDocumentbyCitizenTypeModel(citizensubType);
      
      if (data?.length > 0) {
        return res.status(200).json({
          status: 0,
          message: 'Document sub-type list retrieved successfully',
          data: data,
        });
      } else {
        return res.status(200).json({
          status: 1,
          message: 'No document types found',
          data: []
        });
      }
    } catch (error) {
      console.error('Error in getDocumentTypeListController:', error.message);
      return res.status(500).json({
        status: 1,
        message: 'An error occurred while fetching the document type list',
        error: error.message,
      });
    }
  };