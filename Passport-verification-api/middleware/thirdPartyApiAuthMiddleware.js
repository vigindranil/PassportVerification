import jwt from "jsonwebtoken";

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// create array of object with key as user and value as password
const userArray = [
  { user: "vyoma", password: "@vyoma@123#" },
  { user: "IBUSER", password: "@IBUSER@123#" },
  { user: "Sankalan", password: "@Sankalan@123#" },
]

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from the "Authorization" header
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied! Unauthorized access." });
    }

    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token

    // dynamic user and password check
    const user = userArray.find(user => user.user === decoded?.user && user.password === decoded?.password);
    if(!user){
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
