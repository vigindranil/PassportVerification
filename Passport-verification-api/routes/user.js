// import express from "express";
// import {saveUserRegistration, updateUserActivationStatus ,getDistrictNodalDashBoard} from '../controllers/userController.js';

// const router = express.Router();
// router.post('/saveUser', saveUserRegistration);
// router.post('/updateUser', updateUserActivationStatus);
// router.post('/getDistrictNodalDashBoard', getDistrictNodalDashBoard);
// export default router;


import express from "express";
import {
  saveUserRegistration,
  updateUserActivationStatus,
  getDistrictNodalDashBoard,
} from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * /api/user/saveUser:
 *   post:
 *     summary: Register a new user
 *     description: Save user registration data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User successfully registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registration successful.
 */

/**
 * @swagger
 * /api/user/updateUser:
 *   post:
 *     summary: Update user activation status
 *     description: Update the activation status of an existing user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 12345
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User activation status updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User activation status updated.
 */

/**
 * @swagger
 * /api/user/getDistrictNodalDashBoard:
 *   post:
 *     summary: Get district nodal dashboard data
 *     description: Retrieve data for the district nodal dashboard.
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dashboardData:
 *                   type: object
 *                   example: { "totalUsers": 150, "activeUsers": 120, "inactiveUsers": 30 }
 */

router.post("/saveUser", saveUserRegistration);
router.post("/updateUser", updateUserActivationStatus);
router.post("/getDistrictNodalDashBoard", getDistrictNodalDashBoard);

export default router;