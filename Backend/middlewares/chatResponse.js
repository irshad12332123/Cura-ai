const express = require("express");
const axios = require("axios");
const router = express.Router();
router.post("/generate", async (req, res) => {
  console.log("GENERATE ENDPOINT HIT");
  try {
    const { query, context } = req.body;
    console.log("User query:", query);

    const payload = {
      message: query.trim(),
      context: context || [],
    };
    // actual response prompt
    // const response = await axios.post(
    //   "https://web-production-9f597.up.railway.app/chat",
    //   payload,
    //   {
    //     headers: { "Content-Type": "application/json" },
    //   }
    // );

    response = { data: "Developers are making some real Sh!t, check later" };

    res.json({ result: response.data });
  } catch (err) {
    console.error("Flask error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error communicating with model server" });
  }
});

module.exports = router;
