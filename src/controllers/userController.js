
const User = require("../models/User");

// @desc   Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// @desc   Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, email, and password are required." });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, error: "User already exists with this email." });
    }
    const newUser = new User({ name, email, password, phone });
    const user = await newUser.save();
    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
