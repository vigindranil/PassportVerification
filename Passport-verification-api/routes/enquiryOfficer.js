import express from 'express';
import { getSpecialEnquiryOfficers } from '../controllers/enquiryOfficerController.js';
import {assignApplication} from '../controllers/enquiryOfficerController.js'

const router = express.Router();

router.post('/getSpecialEnquiryOfficers', getSpecialEnquiryOfficers)
router.post('/assignApplication' , assignApplication)

export default router;