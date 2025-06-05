import express from 'express';
import { getApplicationTimeLine, getDashboardCountStateMasterAdmin, getDistrictwiseApplicationCount, getPoliceStationtwiseApplicationCount } from '../controllers/stateAdminController.js';



const router = express.Router();
router.post('/getDashboardCountStateMasterAdmin', getDashboardCountStateMasterAdmin)
router.post('/getDistrictwiseApplicationCount', getDistrictwiseApplicationCount)
router.post('/getPoliceStationtwiseApplicationCount', getPoliceStationtwiseApplicationCount)
router.post('/getApplicationTimeLine', getApplicationTimeLine)

export default router;