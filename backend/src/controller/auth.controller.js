import User from "../models/user.model.js";
import { generateToken } from "../utilis/generateToken.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: "User already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword, role });
  res.json({ user, token: generateToken(user) });
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Compare plain password with stored hash
    const valid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", valid);
    if (!valid) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    res.json({ user, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
