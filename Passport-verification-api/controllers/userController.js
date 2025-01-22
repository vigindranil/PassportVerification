import { saveUserRegistrationModel } from '../models/userModel.js';
import { updateUserActivationStatusModel } from '../models/userModel.js'
import {getDistrictNodalDashBoardModel} from '../models/userModel.js'
import {showuserDetailsModel} from '../models/userModel.js'
export const saveUserRegistration = async (req, res) => {
    try {
        const { UserID,
            UserName,
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
            PSID } = req.body;

            console.log("req.user.UserID", req.user.UserID);
            
        const result = await saveUserRegistrationModel(
            UserID,
            UserName,
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
            req.user.UserID); // change aadhar token

        console.log('askodgjklmv', result);

        if (result == 0) {
            return res.status(200).json({
                status: 0,
                message: "User has been created successfully",
            });
        } else {
            return res.status(400).json({
                status: 1,
                message: "Failed to create user",
            });

        }


    } catch (error) {
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
        const { UserID,

            ActivationStatus } = req.body;
        const [result] = await updateUserActivationStatusModel(UserID,
            ActivationStatus,
            req.user.UserID); // change aadhar token

        if (result == 0) {
            return res.status(200).json({
                status: 0,
                message: "Update user activation status successfully",
            });
        } else {
            return res.status(400).json({
                status: 1,
                message: "Failed to change user activation status",
            });

        }


    } catch (error) {
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
        const [result] = await getDistrictNodalDashBoardModel(req.user.UserID); 
        console.log("result", result);
        
        if (result?.length !== 0) {
            return res.status(200).json({
                status: 0,
                message: "Data fetched successfully",
                data: {
                    Pending:0,
                    Processed:0,
                    Last15DaysPending:0 
                }
            });
        } else {
            return res.status(400).json({
                status: 1,
                message: "No data found",
            });

        }


    } catch (error) {
        console.error("Error fetching :", error);
        res.status(500).json({
            status: 1,
            message: "An error occurred",
            data: null,
        });
    }
};



export const showuserDetails = async (req, res) => {
    try {
        const [result] = await showuserDetailsModel(req.user.UserID); 
        console.log("result", result);
        
        if (result?.length !== 0) {
            return res.status(200).json({
                status: 0,
                message: "Data fetched successfully",
                data: result
            });
        } else {
            return res.status(400).json({
                status: 1,
                message: "No data found",
            });

        }


    } catch (error) {
        console.error("Error fetching :", error);
        res.status(500).json({
            status: 1,
            message: "An error occurred",
            data: null,
        });
    }
};

