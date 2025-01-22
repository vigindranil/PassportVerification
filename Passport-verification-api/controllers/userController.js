// import { saveUserRegistrationModel } from '../models/userModel.js';
// import { updateUserActivationStatusModel } from '../models/userModel.js'
// import {getDistrictNodalDashBoardModel} from '../models/userModel.js'
// export const saveUserRegistration = async (req, res) => {
//     try {
//         const { UserID,
//             UserName,
//             UserPassword,
//             Firstname,
//             LastName,
//             MobileNo,
//             EmailID,
//             Gender,
//             AADHAARNo,
//             Designation,
//             UserRoleID,
//             DistrictID,
//             PSID } = req.body;
//         const result = await saveUserRegistrationModel(UserID,
//             UserName,
//             UserPassword,
//             Firstname,
//             LastName,
//             MobileNo,
//             EmailID,
//             Gender,
//             AADHAARNo,
//             Designation,
//             UserRoleID,
//             DistrictID,
//             PSID, req.user.UserID); // change aadhar token

//         console.log('askodgjklmv', result);

//         if (result == 0) {
//             return res.status(200).json({
//                 status: 0,
//                 message: "User has been created successfully",
//             });
//         } else {
//             return res.status(400).json({
//                 status: 1,
//                 message: "Failed to create user",
//             });

//         }


//     } catch (error) {
//         console.error("Error fetching state information:", error);
//         res.status(500).json({
//             status: 1,
//             message: "An error occurred",
//             data: null,
//         });
//     }
// };


// export const updateUserActivationStatus = async (req, res) => {
//     try {
//         const { UserID,

//             ActivationStatus, } = req.body;
//         const [result] = await updateUserActivationStatusModel(UserID,
//             ActivationStatus,
//             req.user.UserID); // change aadhar token

//         if (result == 0) {
//             return res.status(200).json({
//                 status: 0,
//                 message: "Update user activation status successfully",
//             });
//         } else {
//             return res.status(400).json({
//                 status: 1,
//                 message: "Failed to change user activation status",
//             });

//         }


//     } catch (error) {
//         console.error("Error fetching state information:", error);
//         res.status(500).json({
//             status: 1,
//             message: "An error occurred while fetching state information",
//             data: null,
//         });
//     }
// };


// export const getDistrictNodalDashBoard = async (req, res) => {
//     try {
//         const [result] = await getDistrictNodalDashBoardModel(req.user.UserID); 
//         console.log("result", result);
        
//         if (result?.length !== 0) {
//             return res.status(200).json({
//                 status: 0,
//                 message: "Data fetched successfully",
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


import { saveUserRegistrationModel, updateUserActivationStatusModel, getDistrictNodalDashBoardModel } from '../models/userModel.js';
import logger from '../utils/logger.js'; // Import logger

export const saveUserRegistration = async (req, res) => {
    try {
        const { UserID, UserName, UserPassword, Firstname, LastName, MobileNo, EmailID, Gender, AADHAARNo, Designation, UserRoleID, DistrictID, PSID } = req.body;

        logger.info(`Attempting to create user: ${UserID} - ${UserName}`);
        
        const result = await saveUserRegistrationModel(UserID, UserName, UserPassword, Firstname, LastName, MobileNo, EmailID, Gender, AADHAARNo, Designation, UserRoleID, DistrictID, PSID, req.user.UserID);

        logger.info(`User creation result for ${UserID}: ${result}`);

        if (result == 0) {
            logger.info(`User ${UserID} created successfully`);
            return res.status(200).json({
                status: 0,
                message: "User has been created successfully",
            });
        } else {
            logger.error(`Failed to create user ${UserID}`);
            return res.status(400).json({
                status: 1,
                message: "Failed to create user",
            });
        }

    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);
        console.error("Error fetching state information:", error);
        res.status(500).json({
            status: 1,
            message: "An error occurred",
            data: null,
        });
    }
};

export const updateUserActivationStatus = async (req, res) => {
    try {
        const { UserID, ActivationStatus } = req.body;

        logger.info(`Attempting to update activation status for UserID: ${UserID}`);

        const [result] = await updateUserActivationStatusModel(UserID, ActivationStatus, req.user.UserID);

        logger.info(`Update result for UserID: ${UserID} - Status: ${result}`);

        if (result == 0) {
            logger.info(`Activation status for UserID: ${UserID} updated successfully`);
            return res.status(200).json({
                status: 0,
                message: "Update user activation status successfully",
            });
        } else {
            logger.error(`Failed to update activation status for UserID: ${UserID}`);
            return res.status(400).json({
                status: 1,
                message: "Failed to change user activation status",
            });
        }

    } catch (error) {
        logger.error(`Error updating activation status for UserID: ${UserID}: ${error.message}`);
        console.error("Error fetching state information:", error);
        res.status(500).json({
            status: 1,
            message: "An error occurred while fetching state information",
            data: null,
        });
    }
};

export const getDistrictNodalDashBoard = async (req, res) => {
    try {
        logger.info(`Fetching district nodal dashboard for UserID: ${req.user.UserID}`);

        const [result] = await getDistrictNodalDashBoardModel(req.user.UserID);
        logger.info(`District nodal dashboard result: ${JSON.stringify(result)}`);

        if (result?.length !== 0) {
            logger.info("District nodal dashboard data fetched successfully");
            return res.status(200).json({
                status: 0,
                message: "Data fetched successfully",
            });
        } else {
            logger.warn("No district nodal dashboard data found");
            return res.status(400).json({
                status: 1,
                message: "No data found",
            });
        }

    } catch (error) {
        logger.error(`Error fetching district nodal dashboard: ${error.message}`);
        console.error("Error fetching:", error);
        res.status(500).json({
            status: 1,
            message: "An error occurred",
            data: null,
        });
    }
};


