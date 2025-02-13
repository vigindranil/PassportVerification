import jwt from "jsonwebtoken";
import { getUserVerifyToken } from "../models/authModels.js";
// import client from '../redisClient.js';


// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  try {
    const token_base64 = req.headers.authorization?.split(" ")[1]; // Extract token from the "Authorization" header
    if (!token_base64) {
      return res
        .status(401)
        .json({ message: "Access denied! Unauthorized access." });
    }

    const token = atob(token_base64); // Extract
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token

    // sp for check session token
    
    // const [rows] = await getUserVerifyToken(decoded.UserID);
    // console.log("local token",token);
    // console.log("db token",rows?.JWTToken);
    
    // if (new Date() > rows?.TokenValidUpto) {
    //   return res.status(401).json({status: 1, message: 'Token expired! Please Login again to continue.' });
    // } else
    // if(rows?.JWTToken != token){
    //   return res.status(401).json({status: 1, message: 'Access denied! Unauthorized access.' });
    // }

    // sp for check session token
    
    // const [rows] = await getUserVerifyToken(decoded.UserID);
    // console.log("local token",token);
    // console.log("db token",rows?.JWTToken);
    
    // if (new Date() > rows?.TokenValidUpto) {
    //   return res.status(401).json({status: 1, message: 'Token expired! Please Login again to continue.' });
    // } else
    // if(rows?.JWTToken != token){
    //   return res.status(401).json({status: 1, message: 'Access denied! Unauthorized access.' });
    // }

    // Retrieve token from Redis using user_id
    // const storedToken = await client.get(`user:${decoded.UserID}:token`);

    // if (!storedToken || storedToken !== token_base64) {
    //   return res
    //     .status(401)
    //     .json({ status: 1, message: "Token expired or invalid" });
    // }

    req.user = decoded; // Attach user info to the request

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("error", error);

    res.status(401).json({ status: 1, message: "Invalid or expired token." });
  }
};

export default verifyToken;
