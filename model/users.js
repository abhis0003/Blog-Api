const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  address: String,
  email : String,
  role: String,
  password: String,
  token: String,
  age: String,
});

exports.UserModel  = mongoose.model("users", userSchema);

