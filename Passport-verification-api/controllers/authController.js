import jwt from "jsonwebtoken";
import { genearateOtp, getUserLoginModel, updateAuthToken } from "../models/authModels.js";
import { generateOtpAadhaar, sendSMSInternally, verifyOtpAadhaar } from "./thirdPartyAPI.js";
import logger from "../utils/logger.js";
// import client from "../redisClient.js";

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

    if (rows !== undefined && rows[0]?.length !== 0) {
        
        // const aadhaar_response = await generateOtpAadhaar(
        //   atob(rows[0]["AADHAARNo"]),
        //   rows[0]["UserID"]
        // );

        // if (aadhaar_response?.status != 200) {
        //   return res.status(400).json({
        //     status: 1,
        //     message: aadhaar_response?.error?.message || "Failed to send OTP",
        //   });
        // }
        // if (aadhaar_response?.data?.code != "1001") {
        //   return res.status(400).json({
        //     status: 1,
        //     message: aadhaar_response?.data?.message || "Failed to send OTP",
        //   });
        // }
      const transactionId = "";
      // const transactionId = aadhaar_response?.transaction_id;

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
          isLoggedIn: 0,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      const token = btoa(jwt_token);
      console.log("token");
      

      const [result] = await updateAuthToken(rows[0]["UserID"], token, transactionId);

      res.cookie("data", token);

      logger.debug(
        JSON.stringify({
          API: "sendOtp",
          REQUEST: { username, password },
          RESPONSE: {
            status: 0,
            message: "OTP sent successfully",
            token: token,
          },
        })
      );

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
    logger.error(error.message);

    return res.status(500).json({
      status: 1,
      message: "An error occurred, Please try again",
      data: null,
    });
  }
};

export const sendOtpV1 = async (req, res) => {
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

    const rows = await genearateOtp(username, btoa(password));
    console.log("rows", rows);
    
    if (!rows || rows.length == 0) {
      return res.status(400).json({
        status: 1,
        message: "Invalid username or password",
      });
    }

    if (rows[0][0].ErrorCode == 0) {

      logger.debug(
        JSON.stringify({
          API: "sendOtp",
          REQUEST: { username, password },
          RESPONSE: {
            status: 0,
            message: "OTP sent successfully",
            otp: rows[0][0]["OTP"],
          },
        })
      );

      const smstext = `OTP to login in Passport Verification Application is ${rows[0][0]["OTP"]} DITE GoWB`;
      // const mobileNumber = mobile;
      const mobileNumber = "6202734737";
      const smsCategory = "login message";
      const tpid = "1307172596406664446";

      const smsStatus = await sendSMSInternally(smstext, mobileNumber, smsCategory, tpid);

      res.status(200).json({
        status: 0,
        message: "OTP sent successfully",
      });
    } else {
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

    console.log("otp", otp);
    if (!otp) {
      logger.debug(
        JSON.stringify({
          API: "verifyOtp",
          REQUEST: { otp },
          RESPONSE: {
            status: 1,
            message: "Invalid OTP",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Invalid OTP",
      });
    }

    // const aadhaar_response = await verifyOtpAadhaar(
    //     otp,
    //     req.user.UserID,
    //     req.user.TransactionId
    // );
    // const transactionId = aadhaar_response?.transaction_id;

    const transactionId = "";

    console.log("jwt", {
      ...req.user,
      TransactionId: transactionId,
      isLoggedIn: 1,
    });

    const jwt_token = jwt.sign(
      {
        ...req.user,
        TransactionId: transactionId,
        isLoggedIn: 1,
      },
      JWT_SECRET
    );

    const token = btoa(jwt_token);

    const [result] = await updateAuthToken(req.user.UserID, token, transactionId);

    res.cookie("data", token);

    // if (aadhaar_response?.status != 200) {
    //   return res.status(400).json({
    //     status: 1,
    //     message: aadhaar_response?.error?.message || "Failed to send OTP",
    //     token: token,
    //   });
    // }
    // if (aadhaar_response?.data?.code != 1001) {
    //   return res.status(400).json({
    //     status: 1,
    //     message: aadhaar_response?.data?.message || "Failed to send OTP",
    //     token: token,
    //   });
    // }

    // if(aadhaar_response?.data?.code == '1001' || otp == '999999'){
    if (otp == "999999") {
      res.cookie("type", req.user.UserTypeID);
      res.cookie("name", req.user.UserFullName);
      res.cookie("district", req.user.DistrictName);
      res.cookie("ps", req.user.PoliceStationName);
      res.cookie("DistrictID", req.user.DistrictID);
      logger.debug(
        JSON.stringify({
          API: "sendOtp",
          REQUEST: { otp },
          RESPONSE: {
            status: 0,
            message: "OTP sent successfully",
            type: req.user.UserTypeID,
            name: req.user.UserFullName,
            district: req.user.DistrictName,
            ps: req.user.PoliceStationName,
            token: token,
          },
        })
      );
 
      res.status(200).json({
        status: 0,
        message: "OTP sent successfully",
        type: req.user.UserTypeID,
        name: req.user.UserFullName,
        district: req.user.DistrictName,
        DistrictID: req.user.DistrictID,
        ps: req.user.PoliceStationName,
        isLoggedIn: 1,
        token: token,
      });
    } else {
      res.status(400).json({
        status: 1,
        message: "Invalid OTP",
        token: token,
      });
    }
  } catch (error) {
    lo
    logger.error(error.message);
    // const result = await client.del(`user:${req.user.UserID}:token`);
    return res.status(500).json({
      status: 1,
      message: "An error occurred, Please try again",
      data: null,
    });
  }
};

export const verifyOtpV1 = async (req, res) => {
  try {
    const { username, otp } = req.body;

    if (!otp) {
      logger.debug(
        JSON.stringify({
          API: "verifyOtp",
          REQUEST: { otp },
          RESPONSE: {
            status: 1,
            message: "Invalid OTP",
          },
        })
      );
      return res.status(400).json({
        status: 1,
        message: "Invalid OTP",
      });
    }


    const transactionId = "";

    const jwt_token = jwt.sign(
      {
        ...req.user,
        TransactionId: transactionId,
        isLoggedIn: 1,
      },
      JWT_SECRET
    );

    const token = btoa(jwt_token);

    const [result] = await updateAuthToken(req.user.UserID, token, transactionId);

    res.cookie("data", token);

    // if(aadhaar_response?.data?.code == '1001' || otp == '999999'){
    if (otp == "999999") {
      res.cookie("type", req.user.UserTypeID);
      res.cookie("name", req.user.UserFullName);
      res.cookie("district", req.user.DistrictName);
      res.cookie("ps", req.user.PoliceStationName);
      res.cookie("DistrictID", req.user.DistrictID);
      logger.debug(
        JSON.stringify({
          API: "sendOtp",
          REQUEST: { otp },
          RESPONSE: {
            status: 0,
            message: "OTP sent successfully",
            type: req.user.UserTypeID,
            name: req.user.UserFullName,
            district: req.user.DistrictName,
            ps: req.user.PoliceStationName,
            token: token,
          },
        })
      );
 
      res.status(200).json({
        status: 0,
        message: "OTP sent successfully",
        type: req.user.UserTypeID,
        name: req.user.UserFullName,
        district: req.user.DistrictName,
        DistrictID: req.user.DistrictID,
        ps: req.user.PoliceStationName,
        isLoggedIn: 1,
        token: token,
      });
    } else {
      res.status(400).json({
        status: 1,
        message: "Invalid OTP",
        token: token,
      });
    }
  } catch (error) {
    logger.error(error.message);
    // const result = await client.del(`user:${req.user.UserID}:token`);
    return res.status(500).json({
      status: 1,
      message: "An error occurred, Please try again",
      data: null,
    });
  }
};
