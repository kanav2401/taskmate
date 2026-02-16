import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔥 Auto unban if temporary ban expired
    if (user.isBlocked && user.banUntil && new Date() > user.banUntil) {
      user.isBlocked = false;
      user.banUntil = null;
      user.banReason = "";
      await user.save();
    }

    // 🔥 Permanent ban check
    if (user.isPermanentlyBlocked) {
      return res.status(403).json({
        message: "You are permanently banned.",
      });
    }

    // 🔥 Temporary ban check
    if (user.isBlocked) {
      return res.status(403).json({
        message: `You are banned until ${user.banUntil}`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
