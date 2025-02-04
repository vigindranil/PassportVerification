import express from 'express';
import { getSpecialEnquiryOfficers } from '../models/enquiryOfficerModel.js';


const router = express.Router();

router.post('/getSpecialEnquiryOfficers', getSpecialEnquiryOfficers)

export default router;