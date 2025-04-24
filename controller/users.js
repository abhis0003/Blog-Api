const { UserModel } = require("../model/users");
const {
  createValidator,
  deleteValidator,
  updateValidator,
} = require("../validator/users");
const { hashPassword } = require("../utils/helper");


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

  return model;
};
exports.userMapper  =  mapper
exports.createUser = async (req, res) => {
  try {
    const { error } = createValidator.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.body.password = await hashPassword(req.body.password);

    const newTodo = await UserModel.create(req.body);
    res.status(201).json({
      message: "ok",
      data: mapper(newTodo),
    });
  } catch (error) {
    res.status(400).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const users = await UserModel.find();

    const userWoutPass = users.map(mapper);

    res.status(200).json({
      message: "fetched successfully",
      data: userWoutPass,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { error } = deleteValidator.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "id not found" });
    }

    const deleteUser = await UserModel.findByIdAndDelete(id);

    if (!deleteUser) {
      return res
        .status(404)
        .json({ error: "no such user found to be deleted" });
    }

    res.status(200).json({
      message: "user deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {

    const { error } = updateValidator.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "cant updated id required" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json({
      message: " updated success",
      data: mapper(updatedUser)
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
