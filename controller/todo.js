const { todoModel } = require("../model/todo");
const { todoValidator, updateValidator } = require("../validator/todo");
const { userMapper } = require("./users");

const mapper = (entity) => {
  const model = {
    id: entity._id,
    title: entity.title,
    detail: entity.detail,
    completed: entity.completed,
  };
  if (entity.user) {
    model.user = userMapper(entity.user);
  }
  return model;
};

exports.createTodo = async (req, res) => {
  try {
    const { error } = todoValidator.validate(req.body);
    const userId = req.userId;
    if (error) {
      return res.status(400).json({
        error: "fill correctly",
      });
    }
    req.body.user = userId;
    const newTodo = await todoModel.create(req.body);
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

exports.getTodo = async (req, res) => {
  try {
    const where = {};

    if (req.query.userId) {
      where.user = req.query.userId;
    }

    const todo = await todoModel.find(where);
    const mapTodo = todo.map(mapper);
    res.status(200).json({
      message: "fetched successfully",
      data: mapTodo,
    }); // user id filter //
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { error } = updateValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "fill correctly",
        error: error.message,
      });
    }

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "id not found" });
    }

    const updatedTodo = await todoModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    if (!id) {
      return res.status(400).json({ error: "id not found" });
    }

    const deletedTodo = await todoModel.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({
      message: "Todo deleted success",
      data: deletedTodo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json("id not found");
    }
    const todo = await todoModel.findById(id).populate({ path: "user" });
    if (!todo) {
      return res.status(400).json("no todo found");
    }

    res.status(200).json({
      message: "todo found by id",
      data: mapper(todo),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
