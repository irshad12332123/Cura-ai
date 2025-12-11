const express = require("express");
const cors = require("cors");
const auth = require("./routes/auth.route.js");
const chatResponse = require("./middlewares/chatResponse.js");
const connectToMongo = require("./DBConnection.js");
const historyRouter = require("./routes/history.route.js");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config({ path: "../.env" });

connectToMongo();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cura-ai-peach.vercel.app",
      "https://curics.in",
      "https://www.curics.in",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// FIX for Express 5 path-to-regexp change
app.options("/*", cors());

app.use(express.json());

app.use("/auth", auth);
app.use("/api", chatResponse);
app.use("/api/history", historyRouter);

app.listen(PORT, () => {
  console.log(`SERVER RUNNING AT PORT ${PORT}`);
});
