import jwt from "jsonwebtoken";


export const test = async (req, res) => {
  try {

    // how to get user details by jwt token
    console.log("user id",req.user.UserID);
    
    res.json({
      status: 0,
      message: "State information fetched successfully",
    });

    
  } catch (error) {
    console.error("Error fetching state information:", error);
    res.status(500).json({
      status: 1,
      message: "An error occurred while fetching state information",
      data: null,
    });
  }
};