import { updateAuthToken } from "../models/authModels.js";
import { logoutModel } from "../models/logoutModel.js";
import {
  getApplicationStatusModel,
  saveUserRegistrationModel,
} from "../models/userModel.js";
import { updateUserActivationStatusModel } from "../models/userModel.js";
import { showuserDetailsModel } from "../models/userModel.js";
import { getApplicationCountsv1Model } from "../models/userModel.js";
import logger from "../utils/logger.js";
import { saveTransactionHistory } from "../models/logModel.js";
// import client from "../redisClient.js";
/**
 * @swagger
 * /saveUserRegistration:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: number
 *               UserName:
 *                 type: string
 *               UserPassword:
 *                 type: string
 *               Firstname:
 *                 type: string
 *               LastName:
 *                 type: string
 *               MobileNo:
 *                 type: string
 *               EmailID:
 *                 type: string
 *               Gender:
 *                 type: string
 *               AADHAARNo:
 *                 type: string
 *               Designation:
 *                 type: string
 *               UserRoleID:
 *                 type: number
 *               DistrictID:
 *                 type: number
 *               PSID:
 *                 type: number
 *             required:
 *               - UserID
 *               - UserName
 *               - UserPassword
 *               - Firstname
 *               - MobileNo
 *               - EmailID
 *               - UserRoleID
 *               - DistrictID
 *     responses:
 *       200:
 *         description: User created successfully.
 *       400:
 *         description: Failed to create user.
 *       500:
 *         description: Internal server error.
 */
export const saveUserRegistration = async (req, res) => {
  try {
    const {
      UserID,
      UserName,
      FullName,
      UserPassword,
      Firstname,
      LastName,
      MobileNo,
      EmailID,
      Gender,
      AADHAARNo,
      Designation,
      UserRoleID,
      DistrictID,
      PSID,
    } = req.body;

    console.log("req.user.UserID", req.user.UserID);
    const ipaddress = "test";
    const macAddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "saveUserRegistration";
    const json = "{}";

    if(!UserName){
      return res.status(400).json({
        status: 1,
        message: "Please enter username",
      });
    }
    if(!FullName){
      return res.status(400).json({
        status: 1,
        message: "Please enter FullName",
      });
    }
    if(!MobileNo){
      return res.status(400).json({
        status: 1,
        message: "Please enter FullName",
      });
    }
    if(!Gender){
      return res.status(400).json({
        status: 1,
        message: "Please enter FullName",
      });
    }
    if(!AADHAARNo){
      return res.status(400).json({
        status: 1,
        message: "Please enter FullName",
      });
    }
    if(!Designation){
      return res.status(400).json({
        status: 1,
        message: "Please enter FullName",
      });
    }
    if(!UserRoleID){
      return res.status(400).json({
        status: 1,
        message: "Please enter FullName",
      });
    }





    //  const saveTransaction = await saveTransactionHistory(ipaddress , macAddress , Longitude , Latitude , 0 ,OperationName ,json ,req.user.UserID)
    const result = await saveUserRegistrationModel(
      UserID,
      UserName,
      FullName,
      btoa(UserPassword),
      Firstname,
      LastName,
      MobileNo,
      EmailID,
      Gender,
      btoa(AADHAARNo),
      Designation,
      UserRoleID,
      DistrictID,
      PSID,
      req.user.UserID
    ); // change aadhar token

    console.log("askodgjklmv", result);

    if (result == 0) {
      logger.debug(
        JSON.stringify({
          API: "saveUserRegistration",
          REQUEST: {
            UserID,
            UserName,
            FullName,
            UserPassword,
            Firstname,
            LastName,
            MobileNo,
            EmailID,
            Gender,
            AADHAARNo,
            Designation,
            UserRoleID,
            DistrictID,
            PSID,
          },
          RESPONSE: {
            status: 0,
            message: "User has been created successfully",
          },
        })
      );
      return res.status(200).json({
        status: 0,
        message: "User has been created successfully",
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "saveUserRegistration",
          REQUEST: {
            UserID,
            UserName,
            FullName,
            UserPassword,
            Firstname,
            LastName,
            MobileNo,
            EmailID,
            Gender,
            AADHAARNo,
            Designation,
            UserRoleID,
            DistrictID,
            PSID,
          },
          RESPONSE: {
            status: 1,
            message: "Failed to create user",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Failed to create user",
      });
    }
  } catch (error) {
    logger.error("Error fetching state information:", error);
    res.status(500).json({
      status: 1,
      message: "An error occurred",
      data: null,
    });
  }
};

/**
 * @swagger
 * /updateUserActivationStatus:
 *   post:
 *     summary: Update user activation status
 *     description: Changes the activation status of a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: number
 *               ActivationStatus:
 *                 type: boolean
 *             required:
 *               - UserID
 *               - ActivationStatus
 *     responses:
 *       200:
 *         description: User activation status updated successfully.
 *       400:
 *         description: Failed to change user activation status.
 *       500:
 *         description: Internal server error.
 */

export const updateUserActivationStatus = async (req, res) => {
  try {
    const { UserID, ActivationStatus } = req.body;
    const ipaddress = "test";
    const macAddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "updateUserActivationStatus";
    const json = "{}";
    // const saveTransaction = await saveTransactionHistory(ipaddress , macAddress , Longitude , Latitude , 0 ,OperationName ,json ,EntryUserId)
    const result = await updateUserActivationStatusModel(
      UserID,
      ActivationStatus
    ); // change aadhar token

    console.log("result", result);

    if (result == 0) {
      logger.debug(
        JSON.stringify({
          API: "updateUserActivationStatus",
          REQUEST: { UserID, ActivationStatus },
          RESPONSE: {
            status: 0,
            message: "Update user activation status successfully",
          },
        })
      );
      return res.status(200).json({
        status: 0,
        message: "Update user activation status successfully",
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "updateUserActivationStatus",
          REQUEST: { UserID, ActivationStatus },
          RESPONSE: {
            status: 1,
            message: "Failed to change user activation status",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Failed to change user activation status",
      });
    }
  } catch (error) {
    logger.error("Error:", error);
    res.status(500).json({
      status: 1,
      message: "An error occurred",
      data: null,
    });
  }
};

/**
 * @swagger
 * /getDistrictNodalDashBoard:
 *   get:
 *     summary: Fetch district nodal dashboard data
 *     description: Retrieves data for the district nodal dashboard.
 *     responses:
 *       200:
 *         description: Data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Data fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Pending:
 *                       type: number
 *                       example: 0
 *                     Processed:
 *                       type: number
 *                       example: 0
 *                     Last15DaysPending:
 *                       type: number
 *                       example: 0
 *       400:
 *         description: No data found.
 *       500:
 *         description: Internal server error.
 */
// export const getDistrictNodalDashBoard = async (req, res) => {
//     try {
//         const [result] = await getDistrictNodalDashBoardModel(req.user.UserID);
//         console.log("result", result);

//         if (result?.length !== 0) {
//             return res.status(200).json({
//                 status: 0,
//                 message: "Data fetched successfully",
//                 data: {
//                     Pending: 0,
//                     Processed: 0,
//                     Last15DaysPending: 0
//                 }
//             });
//         } else {
//             return res.status(400).json({
//                 status: 1,
//                 message: "No data found",
//             });

//         }

//     } catch (error) {
//         console.error("Error fetching :", error);
//         res.status(500).json({
//             status: 1,
//             message: "An error occurred",
//             data: null,
//         });
//     }
// };

/**
 * @swagger
 * /showuserDetails:
 *   get:
 *     summary: Fetch user details
 *     description: Retrieves details of the logged-in user.
 *     responses:
 *       200:
 *         description: Data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Data fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       UserID:
 *                         type: number
 *                         example: 1
 *                       UserName:
 *                         type: string
 *                         example: "john_doe"
 *                       EmailID:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       Designation:
 *                         type: string
 *                         example: "Officer"
 *       400:
 *         description: No data found.
 *       500:
 *         description: Internal server error.
 */

export const showuserDetails = async (req, res) => {
  try {
    const ipaddress = "test";
    const macAddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "showuserDetails";
    const json = "{}";
    //  const saveTransaction = await saveTransactionHistory(ipaddress , macAddress , Longitude , Latitude , 0,OperationName ,json ,EntryUserId)
    const [result] = await showuserDetailsModel(req.user.UserID);
    console.log("result", result);

    if (result?.length !== 0) {
      logger.debug(
        JSON.stringify({
          API: "showuserDetails",
          REQUEST: { EntryuserId: req.user.UserID },
          RESPONSE: {
            status: 0,
            message: "Data fetched successfully",
            data: result,
          },
        })
      );
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: result,
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "showuserDetails",
          REQUEST: { EntryuserId: req.user.UserID },
          RESPONSE: {
            status: 1,
            message: "No data found",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "No data found",
      });
    }
  } catch (error) {
    logger.error("Error fetching :", error);
    res.status(500).json({
      status: 1,
      message: "An error occurred",
      data: null,
    });
  }
};

export const getApplicationStatus = async (req, res) => {
  try {
    const { status_id, periord_id } = req.body;
    const ipaddress = "test";
    const macAddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "getApplicationStatus";
    const json = "{}";
    //  const saveTransaction = await saveTransactionHistory(ipaddress , macAddress , Longitude , Latitude , 0 ,OperationName ,json ,EntryUserId)

    const [result] = await getApplicationStatusModel(
      req.user.UserID,
      status_id,
      periord_id
    );
    console.log("result", result);

    if (result?.length > 0) {
      logger.debug(
        JSON.stringify({
          API: "getApplicationStatus",
          REQUEST: { status_id, periord_id },
          RESPONSE: {
            status: 0,
            message: "Data fetched successfully",
            data: result,
          },
        })
      );
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: result,
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "getApplicationStatus",
          REQUEST: { status_id, periord_id },
          RESPONSE: {
            status: 1,
            message: "No data found",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "No data found",
      });
    }
  } catch (error) {
    logger.error("Error fetching :", error);
    res.status(500).json({
      status: 1,
      message: "An error occurred",
      data: null,
    });
  }
};

export const getApplicationCountsv1 = async (req, res) => {
  try {
    const ipaddress = "test";
    const macAddress = "test";
    const Longitude = "test";
    const Latitude = "test";
    const OperationName = "getApplicationCountsv1";
    const json = "{}";
    // const saveTransaction = await saveTransactionHistory(ipaddress , macAddress , Longitude , Latitude , 0 ,OperationName ,json ,req.user.UserID)
    const [result] = await getApplicationCountsv1Model(req.user.UserID);
    console.log("result", result);

    if (result?.length !== 0) {
      logger.debug(
        JSON.stringify({
          API: "getApplicationCountsv1",
          REQUEST: { EntryuserId: req.user.UserID },
          RESPONSE: {
            status: 0,
            message: "Data fetched successfully",
            data: result[0],
          },
        })
      );
      return res.status(200).json({
        status: 0,
        message: "Data fetched successfully",
        data: result[0],
      });
    } else {
      logger.debug(
        JSON.stringify({
          API: "getApplicationCountsv1",
          REQUEST: { EntryuserId: req.user.UserID },
          RESPONSE: {
            status: 1,
            message: "No data found",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "No data found",
      });
    }
  } catch (error) {
    logger.error("Error fetching :", error);
    res.status(500).json({
      status: 1,
      message: "An error occurred",
      data: null,
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Remove token from Redis
    // const result = await client.del(`user:${req.user.UserID}:token`);
    // console.log("result", result);

    return res.status(200).json({
      status: 0,
      message: "Logout successfully",
    });

  } catch (error) {
    logger.error("Error:", error);
    res.status(500).json({
      status: 1,
      message: "Failed to logout",
      data: null,
    });
  }
};
