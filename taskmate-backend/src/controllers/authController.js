import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* Generate Tokens */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

/* REGISTER */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
        },
      });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* REFRESH TOKEN */
export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({ message: "Token refreshed" });

  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

/* LOGOUT */
export const logout = (req, res) => {
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ message: "Logged out" });
};
