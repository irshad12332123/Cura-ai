const express = require("express");
const History = require("../models/History.model");
const auth = require("../middlewares/auth.midleware");
const jwt = require("jsonwebtoken");
const router = express.Router();

// ----------------------------------------------------
// ADD MESSAGE
// ----------------------------------------------------
router.post("/add", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { message, sender } = req.body;

    await History.create({
      userId: decoded.id, // <---- THIS IS THE KEY
      message,
      sender,
    });

    res.json({ message: "Saved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------------------------------
// GET HISTORY FOR A USER
// ----------------------------------------------------
router.get("/:userId", auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId)
      return res.status(403).json({ message: "Forbidden" });

    const messages = await History.find({
      userId: req.params.userId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ----------------------------------------------------
// DELETE ALL HISTORY FOR A USER
// ----------------------------------------------------
router.delete("/:userId", auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId)
      return res.status(403).json({ message: "Forbidden" });

    await History.deleteMany({ userId: req.params.userId });

    return res.status(200).json({ message: "History deleted" });
  } catch (err) {
    console.error("Error deleting history:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
