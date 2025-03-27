import express from "express";
import {saveUserRegistration, updateUserActivationStatus, showuserDetails, getApplicationStatus, getApplicationCountsv1, logout, updatePassword} from '../controllers/userController.js';

const router = express.Router();

router.post('/saveUser', saveUserRegistration);
router.post('/updateUser', updateUserActivationStatus);
router.post('/updatePassword', updatePassword);
router.post('/showuserDetails', showuserDetails);
router.post('/getApplicationStatus', getApplicationStatus);
router.post('/getApplicationCountsV1', getApplicationCountsv1);
router.post('/logout', logout);
export default router;
