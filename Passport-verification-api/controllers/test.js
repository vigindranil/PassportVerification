// import jwt from "jsonwebtoken";


// export const test = async (req, res) => {
//   try {

//     // how to get user details by jwt token
//     console.log("user id",req.user.UserID);
    
//     res.json({
//       status: 0,
//       message: "State information fetched successfully",
//     });

    
//   } catch (error) {
//     console.error("Error fetching state information:", error);
//     res.status(500).json({
//       status: 1,
//       message: "An error occurred while fetching state information",
//       data: null,
//     });
//   }
// };


import jwt from "jsonwebtoken";
import logger from '../utils/logger.js'; // Import the logger

export const test = async (req, res) => {
  try {
    // Log that the route is being accessed
    logger.info('Test route accessed');
    
    // Log user details retrieved from JWT token
    const userId = req.user.UserID;
    logger.info(`UserID fetched from JWT: ${userId}`);
    
    // Respond with a success message
    res.json({
      status: 0,
      message: "State information fetched successfully",
    });
  } catch (error) {
    // Log the error details
    logger.error('Error occurred while fetching state information', { error: error.message, stack: error.stack });
    
    // Respond with an error message
    res.status(500).json({
      status: 1,
      message: "An error occurred while fetching state information",
      data: null,
    });
  }
};