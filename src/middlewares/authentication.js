import jwt from "jsonwebtoken";
import secrets from "../../secrets.js";

const { JWT_SECRET } = secrets;

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized Request" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();  
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        return res.status(401).json({ message: "Token expired" });
      case "JsonWebTokenError":
        return res.status(401).json({ message: "Invalid token" });
      case "NotBeforeError":
        return res.status(401).json({ message: "Token not active" });
      default:
        return res.status(403).json({ message: "Invalid token" });
    }
  }
};
