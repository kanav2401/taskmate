import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    // 🔐 Get access token from HttpOnly cookie
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get full user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🚫 Blocked user check
    if (user.isBlocked) {
      return res.status(403).json({
        message:
          "Your account is temporarily blocked due to missed deadlines. Please contact admin.",
      });
    }

    // Attach full user object
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
