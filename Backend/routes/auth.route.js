const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Please enter details" });

  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      username,
      hashed_password: hashedPassword,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Please enter details" });

  try {
    // Find user
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "Invalid credentials!" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.hashed_password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials!" });

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    return res.status(200).json({
      message: "Login Successful",
      accessToken: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = authRouter;
