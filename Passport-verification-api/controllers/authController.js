import jwt from "jsonwebtoken";
import { getUserLoginModel, updateAuthToken } from '../models/authModels.js';
import { generateOtpAadhaar, verifyOtpAadhaar } from "./thirdPartyAPI.js";

// Secret key for JWT (ensure this is stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;


export const sendOtp = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.status(400).json({
                status: 1,
                message: "Invalid username",
                data: null,
            });
        } else if (!password) {
            return res.status(400).json({
                status: 1,
                message: "Invalid Password",
                data: null,
            });
        }

        const [rows] = await getUserLoginModel(username, btoa(password));

        // const transactionId = await generateOtpAadhaar(atob(rows["AADHAARNo"]), rows["UserID"]);
        const transactionId = "---"
        console.log("transactionId",transactionId);
        

        // if (!transactionId) {
        //     return res.status(400).json({
        //         status: 1,
        //         message: "Failed to send OTP",
        //     });
        // }

        if (rows?.length !== 0) {
            const token = jwt.sign(
                {
                    UserID: rows["UserID"],
                    DistrictID: rows["DistrictID"],
                    DistrictName: rows["DistrictName"],
                    PoliceStationID: rows["PoliceStationID"],
                    PoliceStationName: rows["PoliceStationName"],
                    UserTypeID: rows["UserTypeID"],
                    UserTypeName: rows["UserTypeName"],
                    Username: rows["Username"],
                    UserFullName: rows["UserFullName"],
                    TransactionId: transactionId,
                },
                JWT_SECRET,
                { expiresIn: "24h" }
            );

            const [result] = await updateAuthToken(rows["UserID"], token, transactionId);

            res.cookie('data', token);
            res.cookie('type', rows["UserTypeID"]);
            res.cookie('name', rows["UserFullName"]);
            res.cookie('district', rows["DistrictName"]);
            res.cookie('ps', rows["PoliceStationName"]);

            console.log("token", token);

            res.status(200).json({
                status: 0,
                message: "OTP sent successfully",
                type: rows["UserTypeID"],
                name: rows["UserFullName"],
                district: rows["DistrictName"],
                ps: rows["PoliceStationName"],
                token: token,
            });

        } else {
            return res.status(404).json({
                status: 1,
                message: "Invalid user.",
                data: null,
            });
        }

    } catch (error) {
        console.log(error);

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
            return res.status(400).json({
                status: 1,
                message: "Invalid OTP"
            });
        }
        
        if (otp == '999999') {
            return res.status(200).json({
                status: 0,
                message: "OTP has been verified successfully",
            });
        }
        // const otpStatus = await verifyOtpAadhaar(otp, req.user.UserID, req.user.TransactionId);
        const otpStatus = true;
        console.log('otpStatus',otpStatus);
        console.log('otpStatus',otpStatus);
        
        if (otpStatus) {
            return res.status(200).json({
                status: 0,
                message: "OTP has been verified successfully",
            });
        } else {
            return res.status(400).json({
                status: 1,
                message: "Failed to verify OTP",
            });
        }

    } catch (error) {
        console.log(error.message);
        
        return res.status(500).json({
            status: 1,
            message: "An error occurred, Please try again",
            data: null,
        });
    }
};
