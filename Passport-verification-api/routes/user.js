import express from "express";
import {saveUserRegistration, updateUserActivationStatus ,getDistrictNodalDashBoard} from '../controllers/userController.js';

const router = express.Router();
router.post('/saveUser', saveUserRegistration);
router.post('/updateUser', updateUserActivationStatus);
router.post('/getDistrictNodalDashBoard', getDistrictNodalDashBoard);
export default router;