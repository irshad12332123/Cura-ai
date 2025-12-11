const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  hashed_password: { type: String, required: true },
});

// Prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
