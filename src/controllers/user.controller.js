import User from "../models/user.model.js";
import secrets from "../../secrets.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = secrets;

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "name, email and password are required" });
  }

  const existingUser = await User.find({ email });
  if (existingUser.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created", user: newUser.email });
  } catch {
    res.status(400).json({ message: "Signup failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const Accesstoken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  // Can use refresh token too, but for simplicity, I am not doing it.
  res.json({ message: "Login Successful", token: Accesstoken });
};
