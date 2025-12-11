const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    sender: { type: String, enum: ["User", "Bot"], required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.History || mongoose.model("History", historySchema);
