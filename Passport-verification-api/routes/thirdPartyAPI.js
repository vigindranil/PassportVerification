import express from 'express';
import { getBirthCertificateDetails, getKolkataPoliceCriminalRecordSearchv4, getLandDeedDetails, getMadhyamikCertificate, getPCCApplicationDetails, getPCCCrimeRecordSearch, getWBSEDCLDetails, sendSMS } from '../controllers/thirdPartyAPI.js';

const router = express.Router();

router.post('/getWBSEDCLDetails', getWBSEDCLDetails);
router.post('/getLandDeedDetails', getLandDeedDetails);
router.post('/getBirthCertificateDetails', getBirthCertificateDetails);
router.post('/getKolkataPoliceCriminalRecordSearchv4', getKolkataPoliceCriminalRecordSearchv4);
router.post('/getPCCCrimeRecordSearch', getPCCCrimeRecordSearch);
router.post('/sendSMS', sendSMS);
router.post('/getMadhyamikCertificate', getMadhyamikCertificate);
router.post('/getPCCApplicationDetails', getPCCApplicationDetails);
export default router;
