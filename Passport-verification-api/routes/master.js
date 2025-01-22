import express from "express";
import { getPoliceStationsByDistrict } from '../controllers/masterController.js';
const router = express.Router();

router.post('/getPoliceStationsByDistrict', getPoliceStationsByDistrict);

export default router;