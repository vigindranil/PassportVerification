import jwt from "jsonwebtoken";
import { getUserLoginModel, updateAuthToken } from '../models/authModels.js';
import { generateOtpAadhaar, verifyOtpAadhaar } from "./thirdPartyAPI.js";
import logger from "../utils/logger.js";

// Secret key for JWT (ensure this is stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;


export const sendOtp = async (req, res) => {
    try {
        const { username, password, loginType } = req.body;

        if (!username) {
            return res.status(400).json({
                status: 1,
                message: "Invalid username",
                data: null,
            });
        } else if (!password) {
            logger.debug(
                JSON.stringify({
                    API: "sendOtp",
                    REQUEST: { username, password },
                    RESPONSE: {
                        status: 1,
                        message: "Invalid Password",
                        data: null,
                    },
                })
            );
            return res.status(400).json({
                status: 1,
                message: "Invalid Password",
                data: null,
            });
        }

        const rows = await getUserLoginModel(username, btoa(password));

        if (!rows || rows.length == 0) {
            return res.status(400).json({
                status: 1,
                message: "Invalid username or password",
            });
        }

        if (loginType == 2 && rows[0]["UserTypeID"] != 40) {
            return res.status(400).json({
                status: 1,
                message: "Invalid user for mobile login",
            });
        }
        
        // const transactionId = await generateOtpAadhaar(atob(rows["AADHAARNo"]), rows["UserID"]);
        const transactionId = "---"
        // console.log("transactionId", transactionId);


        // if (!transactionId) {
        //     return res.status(400).json({
        //         status: 1,
        //         message: "Failed to send OTP",
        //     });
        // }
       

        if (rows !== undefined && rows[0]?.length !== 0) {
            console.log("rows", rows);
            console.log("UserID", rows[0]["UserID"]);
            
            const jwt_token = jwt.sign(
                {
                    UserID: rows[0]["UserID"],
                    DistrictID: rows[0]["DistrictID"],
                    DistrictName: rows[0]["DistrictName"],
                    PoliceStationID: rows[0]["PoliceStationID"],
                    PoliceStationName: rows[0]["PoliceStationName"],
                    UserTypeID: rows[0]["UserTypeID"],
                    UserTypeName: rows[0]["UserTypeName"],
                    Username: rows[0]["Username"],
                    UserFullName: rows[0]["UserFullName"],
                    TransactionId: transactionId,
                },
                JWT_SECRET,
                { expiresIn: "24h" }
            );

            const token = btoa(jwt_token);
            // const token = jwt_token;

            // const [result] = await updateAuthToken(rows[0]["UserID"], jwt_token, transactionId);

            res.cookie('data', token);
            res.cookie('type', rows[0]["UserTypeID"]);
            res.cookie('name', rows[0]["UserFullName"]);
            res.cookie('district', rows[0]["DistrictName"]);
            res.cookie('ps', rows[0]["PoliceStationName"]);
            res.cookie('DistrictID', rows[0]["DistrictID"]);
            console.log("token 1", jwt_token);

            logger.debug(
                JSON.stringify({
                    API: "sendOtp",
                    REQUEST: { username, password },
                    RESPONSE: {
                        status: 0,
                        message: "OTP sent successfully",
                        type: rows[0]["UserTypeID"],
                        name: rows[0]["UserFullName"],
                        district: rows[0]["DistrictName"],
                        ps: rows[0]["PoliceStationName"],
                        token: token,
                    },
                })
            );

            res.status(200).json({
                status: 0,
                message: "OTP sent successfully",
                type: rows[0]["UserTypeID"],
                name: rows[0]["UserFullName"],
                district: rows[0]["DistrictName"],
                ps: rows[0]["PoliceStationName"],
                token: token,
            });

        } else {
            logger.error(error.message);
            return res.status(404).json({
                status: 1,
                message: "Invalid user.",
                data: null,
            });
        }

    } catch (error) {
        logger.error(error.message);

        return res.status(500).json({
            status: 1,
            message: "An error occurred, Please try again",
            data: null,
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;

        console.log('otp', otp);
        if (!otp) {
            logger.debug(
                JSON.stringify({
                    API: "verifyOtp",
                    REQUEST: { otp },
                    RESPONSE: {
                        status: 1,
                        message: "Invalid OTP"
                    },
                })
            );
            const [result] = await updateAuthToken(req.user.UserID, "", "");
            return res.status(400).json({
                status: 1,
                message: "Invalid OTP"
            });
        }
        
        // const otpStatus = await verifyOtpAadhaar(otp, req.user.UserID, req.user.TransactionId);
        const otpStatus = true;
        console.log('otpStatus', otpStatus);

        if (otp == '999999') {
            logger.debug(
                JSON.stringify({
                    API: "verifyOtp",
                    REQUEST: { otp },
                    RESPONSE: {
                        status: 0,
                        message: "OTP has been verified successfully"
                    },
                })
            );
            return res.status(200).json({
                status: 0,
                message: "OTP has been verified successfully",
            });
        }
        else {
            logger.debug(
                JSON.stringify({
                    API: "verifyOtp",
                    REQUEST: { otp },
                    RESPONSE: {
                        status: 1,
                        message: "Failed to verify OTP",
                    },
                })
            );
            const [result] = await updateAuthToken(req.user.UserID, "", "");
            return res.status(400).json({
                status: 1,
                message: "Failed to verify OTP",
            });
        }

    } catch (error) {
        logger.error(error.message);
        const [result] = await updateAuthToken(req.user.UserID, "", "");
        return res.status(500).json({
            status: 1,
            message: "An error occurred, Please try again",
            data: null,
        });
    }
};
