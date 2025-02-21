import express from 'express';
import { getBirthCertificateDetails, getKolkataPoliceCriminalRecordSearchv4, getPCCCrimeRecordSearch, getWBSEDCLDetails } from '../controllers/thirdPartyAPI.js';

const router = express.Router();

router.post('/getWBSEDCLDetails', getWBSEDCLDetails);
router.post('/getBirthCertificateDetails', getBirthCertificateDetails);
router.post('/getKolkataPoliceCriminalRecordSearchv4', getKolkataPoliceCriminalRecordSearchv4);
router.post('/getPCCCrimeRecordSearch', getPCCCrimeRecordSearch);
export default router;
