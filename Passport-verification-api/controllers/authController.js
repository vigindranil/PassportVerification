import jwt from "jsonwebtoken";
import { getUserLoginModel, updateAuthToken } from '../models/authModels.js';
import { generateOtpAadhaar, verifyOtpAadhaar } from "./thirdPartyAPI.js";

// Secret key for JWT (ensure this is stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * /sendOtp:
 *   post:
 *     summary: Send OTP
 *     description: Sends a one-time password (OTP) to the user's Aadhaar-linked mobile number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: OTP sent successfully.
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
 *                   example: "OTP sent successfully"
 *                 token:
 *                   type: string
 *                   example: "JWT_TOKEN_STRING"
 *       400:
 *         description: Bad request (Invalid username or password).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
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

        const transactionId = await generateOtpAadhaar(atob(rows["AADHAARNo"]), rows["UserID"]);
        
        if (!transactionId) {
            return res.status(400).json({
                status: 1,
                message: "Failed to send OTP",
            });
        }

        if (rows.length !== 0) {
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

            res.status(200).json({
                status: 0,
                message: "OTP sent successfully",
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

/**
 * @swagger
 * /verifyOtp:
 *   post:
 *     summary: Verify OTP
 *     description: Verifies the one-time password (OTP) sent to the user's Aadhaar-linked mobile number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The OTP sent to the user.
 *             required:
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verified successfully.
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
 *                   example: "OTP has been verified successfully"
 *       400:
 *         description: Bad request (Invalid OTP).
 *       500:
 *         description: Internal server error.
 */
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
        return res.status(500).json({
            status: 1,
            message: "An error occurred, Please try again",
            data: null,
        });
    }
};
