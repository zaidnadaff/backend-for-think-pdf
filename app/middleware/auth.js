import { verify } from "jsonwebtoken";
import "dotenv/config";

export default authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token authorizaiton denied" });
  }
  const token = authHeader && authHeader.split("")[1];
  const jwt_secret = process.env.JWT_SECRET;
  try {
    const decoded = verify(token, jwt_secret);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    }
    res.status(401).json({ message: "Invalid Token" });
  }
};
