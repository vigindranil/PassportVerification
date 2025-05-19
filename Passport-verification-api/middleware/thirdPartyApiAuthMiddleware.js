import jwt from "jsonwebtoken";

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from the "Authorization" header
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied! Unauthorized access." });
    }

    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token

    // console.log("decoded", decoded);
    

    // sp for check session token
    
    if(decoded?.user !== "vyoma" || decoded?.password !== "@vyoma@123#"){
      return res.status(401).json({status: 1, message: 'Access denied! Unauthorized access.' });
    }

    req.user = decoded; // Attach user info to the request

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // console.log("error", error);

    res.status(401).json({ status: 1, message: "Invalid or expired token." });
  }
};

export default verifyToken;
