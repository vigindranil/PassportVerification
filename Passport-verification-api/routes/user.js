import express from "express";
import {saveUserRegistration, updateUserActivationStatus, showuserDetails, getApplicationStatus, getApplicationCountsv1, logout, updatePassword, getApplicationStatusV3} from '../controllers/userController.js';

const router = express.Router();

router.post('/saveUser', saveUserRegistration);
router.post('/updateUser', updateUserActivationStatus);
router.post('/updatePassword', updatePassword);
router.post('/showuserDetails', showuserDetails);
router.post('/getApplicationStatus', getApplicationStatus);
router.post('/getApplicationStatusV3', getApplicationStatusV3);
router.post('/getApplicationCountsV1', getApplicationCountsv1);
router.post('/logout', logout);
export default router;
