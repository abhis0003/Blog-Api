const { UserModel } = require("../model/users");
const {
  hashPassword,
  matchPassword,
  generateToken,
} = require("../utils/helper");
const { createValidator, loginvalidator } = require("../validator/users");







const mapper = (entity) => {
  const model = {
    id: entity._id,
    email: entity.email,
    name: entity.name,
    phone: entity.phone,
    address: entity.address,
    age: entity.age,
    role: entity.role,
  };
  if (entity.token) {
    model.token = entity.token;
  }
  return model;
};



exports.register = async (req, res) => {
  try {
    const { error } = createValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(500).json("user found use another email");
    }

    req.body.password = await hashPassword(req.body.password);

    const newUser = await UserModel.create(req.body);

    const userwithoutpass = mapper(newUser);

    return res
      .status(201)
      .json({ message: "user registered successfully", data: userwithoutpass });
  } catch (error) {
    res.status(500).json(`registration failed : ${error.message}`);
  }
};
exports.login = async (req, res) => {
  try {
    const { error } = loginvalidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json("No user found");

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = await generateToken(user.id);

    user.token = token;
    await user.save();

    res.status(200).json({ message: "Login successful", data: mapper(user) });
  } catch (error) {
    res.status(500).json(`Login failed: ${error.message}`);
  }
};
