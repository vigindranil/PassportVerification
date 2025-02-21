import express from 'express';
import { getSpecialEnquiryOfficers } from '../controllers/enquiryOfficerController.js';
import {assignApplication} from '../controllers/enquiryOfficerController.js'
import {getApplicationStatus} from '../controllers/enquiryOfficerController.js'
import {getCountSE} from '../controllers/enquiryOfficerController.js'
const router = express.Router();

router.post('/getSpecialEnquiryOfficers', getSpecialEnquiryOfficers)
router.post('/assignApplication' , assignApplication)
router.post('/getApplicationStatus' , getApplicationStatus)
router.post('/getCountSE',getCountSE)
export default router;