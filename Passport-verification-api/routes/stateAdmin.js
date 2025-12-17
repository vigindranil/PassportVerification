import express from 'express';
import { applicationStatusByFileNumber, getApplicationTimeLine, getDashboardCountStateMasterAdmin, getDistrictwiseApplicationCount, getPoliceStationtwiseApplicationCount, showDistrictNodal } from '../controllers/stateAdminController.js';



const router = express.Router();
router.post('/getDashboardCountStateMasterAdmin', getDashboardCountStateMasterAdmin)
router.post('/getDistrictwiseApplicationCount', getDistrictwiseApplicationCount)
router.post('/getPoliceStationtwiseApplicationCount', getPoliceStationtwiseApplicationCount)
router.post('/getApplicationTimeLine', getApplicationTimeLine)
router.post('/applicationStatusByFileNumber', applicationStatusByFileNumber)
router.post('/showDistrictNodal', showDistrictNodal)


export default router;