const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: String,
  detail: String,
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Types.ObjectId, ref: "users" },
});

exports.todoModel = mongoose.model("todos", todoSchema);
