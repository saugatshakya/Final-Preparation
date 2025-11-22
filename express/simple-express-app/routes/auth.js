const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { body, validationResult } = require("express-validator");

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user
      const user = new User({ name, email, password });
      await user.save();

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.status(201).json({ token, user: { id: user._id, name, email } });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Login
router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log("Login successful for user:", email, "token generated");

    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
