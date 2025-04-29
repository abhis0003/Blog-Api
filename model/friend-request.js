const mongoose = require("mongoose");

const friendRequestModel = new mongoose.Schema({
  senderId: { type: mongoose.Types.ObjectId, ref: "post" },
  recieverId: { type: mongoose.Types.ObjectId, ref : "users" },
  status: {
    type: String,
    enum: ["accepted", "rejected", "pending"],
    default: "pending",
  },
});

exports.friendRequestModel = mongoose.model(
  "freindRequest",
  friendRequestModel
);
