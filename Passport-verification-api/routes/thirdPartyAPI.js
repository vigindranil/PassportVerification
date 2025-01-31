import express from 'express';
import { getWBSEDCLDetails } from '../controllers/thirdPartyAPI.js';

const router = express.Router();

router.post('/getWBSEDCLDetails', getWBSEDCLDetails);
export default router;
