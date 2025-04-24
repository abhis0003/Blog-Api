const mongoose = require("mongoose");

const postModel = new mongoose.Schema({
  title: String,
  description: String,
  user: { type: mongoose.Types.ObjectId, ref: "users" },
  likedBy: [{ type: mongoose.Types.ObjectId, ref: "users" }],
});

exports.postModel = mongoose.model("posts", postModel);
