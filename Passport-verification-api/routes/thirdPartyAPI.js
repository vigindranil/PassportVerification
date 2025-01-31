import express from 'express';
import { getBirthCertificateDetails, getWBSEDCLDetails } from '../controllers/thirdPartyAPI.js';

const router = express.Router();

router.post('/getWBSEDCLDetails', getWBSEDCLDetails);
router.post('/getBirthCertificateDetails', getBirthCertificateDetails);
export default router;
