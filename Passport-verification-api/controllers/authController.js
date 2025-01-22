import jwt from "jsonwebtoken";
import { getUserLoginModel, updateAuthToken } from '../models/authModels.js';
import { generateOtpAadhaar, verifyOtpAadhaar } from "./thirdPartyAPI.js";


// Secret key for JWT (ensure this is stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

// Login route
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

        const [rows] = await getUserLoginModel(username, password);

    // console.log (rows);
        const transactionId = await generateOtpAadhaar(atob(rows["AADHAARNo"]), rows["UserID"]);
        // const transactionId = await generateOtpAadhaar("857162391079", 1);
        
        if (!transactionId) {
            return res.status(400).json({
                status: 1,
                message: "Failed to send OTP",
            })
        }

        if (rows.length !== 0) {
            // Generate JWT token
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
                    TransactionId: transactionId,   // Get from Aadhaar Send OTP
                },
                JWT_SECRET, // Secret key
                { expiresIn: "24h" } //Token expiry
            );


            const [result] = await updateAuthToken(rows["UserID"], token, transactionId); // change aadhar token

        
            // {
            //     httpOnly: true,
            //     maxAge: 24 * 60 * 60 * 1000, // 24 hours
            //     // secure: process.env.NODE_ENV === 'production',
            //     secure: true,
            //     sameSite: 'lax',
            //     path: '/',
            // }
            res.cookie('data', token);

            res.status(200).json({
                status: 0,
                message: "OTP sent successfully",
                token: token
            });

        }
        else {
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

// verify otp route
export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;

        
        if (!otp) {
            return res.status(400).json({
                status: 1,
                message: "Invalid OTP"
            });
        }

        const otpStatus = await verifyOtpAadhaar(otp, req.user.UserID, req.user.TransactionId);

        
        if (otpStatus) { // if otp validated
            return res.status(200).json({
                status: 0,
                message: "OTP has been verified successfully",
            })
        } else {
            return res.status(400).json({
                status: 1,
                message: "Failded to verify OTP",
            });
        }

    } catch (error) {
      
        return res.status(500).json({
            status: 1,
            message: "An error occurred, Please try again",
            data: null,
        });
    }
};

