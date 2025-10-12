const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/generate", async (req, res) => {
  console.log("GENERATE ENDPOINT HIT")
  try {
    const { query } = req.body;
    console.log(query)
const payload = { query: query.trim() }
    const response = await axios.post("http://127.0.0.1:5000/ask", payload , {
        headers: { 'Content-Type': 'application/json' },
    });
    res.json({ result: response.data });
  } catch (err) {
    console.error("Flask error:", err);
    res.status(500).json({ message: "Error communicating with model server" });
  }
});

module.exports = router;
