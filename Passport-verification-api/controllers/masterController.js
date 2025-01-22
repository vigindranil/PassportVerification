import {getPoliceStationsByDistrictModel} from '../models/masterModels.js';
import { showDistrictModel } from '../models/masterModels.js';

export const getPoliceStationsByDistrict = async (req, res) => {
  try {
    const { districtId } = req.body;


    if (!districtId || isNaN(districtId)) {
      return res.status(400).json({
        status: 1,
        message: 'Invalid districtId',
      });
    }

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





export const showDistrict = async (req, res) => {
  try {
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
