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
app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/api", chatResponse);
app.use("/api/history", historyRouter);

app.listen(PORT, () => {
  console.log(`SERVER RUNNING AT PORT ${PORT}`);
});
