const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
console.log("routed");
// Login Route
// Route to fetch all users
router.post("/save-session", (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ message: "userName is required" });
  }

  // Save userName in the session
  req.session.user = userName;
  req.session.save((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to save session" });
    } else {
      return res.status(200).json({ message: "Session saved" });
    }
  });
});
router.post("/", async (req, res) => {
  const { userName, password } = req.body;
  console.log("Received:", req.body);

  try {
    const user = await User.findOne({
      userName: userName,
      password: password,
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Save user in session
    res.status(200).json({ userName: user.userName });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
