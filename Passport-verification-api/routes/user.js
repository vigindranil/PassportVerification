import express from "express";
import {saveUserRegistration, updateUserActivationStatus ,getDistrictNodalDashBoard,showuserDetails } from '../controllers/userController.js';

const router = express.Router();
router.post('/saveUser', saveUserRegistration);
router.post('/updateUser', updateUserActivationStatus);
router.post('/getDistrictNodalDashBoard', getDistrictNodalDashBoard);
router.post('/showuserDetails', showuserDetails);
export default router;