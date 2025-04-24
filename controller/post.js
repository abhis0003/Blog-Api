/* eslint-disable no-unused-vars */
const { verifyToken } = require("../middleware/authMiddleware");
const { postModel } = require("../model/post");
const { createPValidator, upadtePValidator } = require("../validator/post");
const { userMapper } = require("./users");

const mapper = (entity) => {
  const model = {
    id: entity._id,
    title: entity.title,
    description: entity.description,
    isLiked: entity.isLiked,
  };
  if (entity.user) {
    model.user = userMapper(entity.user);
  }
  return model;
};

exports.createPost = async (req, res) => {
  try {
    const { error } = createPValidator.validate(req.body);
    const userId = req.userId;
    if (error) {
      return res.status(400).json({
        message: "id not found",
      });
    }
    req.body.user = userId;
    const newPost = await postModel.create(req.body);
    res.status(201).json({
      message: "ok",
      data: mapper(newPost),
    });
  } catch (error) {
    res.status(400).json({
      message: "internal server error",
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await postModel.find();

    const mapPost = post.map(mapper);
    res.status(200).json({
      message: "fetched successfully",
      data: mapPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { error } = upadtePValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "fill correctly",
      });
    }

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id not found",
      });
    }

    const updatedPost = await postModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post Not Found",
      });
    }

    res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "id not found",
      });
    }

    const deletedPost = await postModel.findByIdAndDelete(id);

    if (!this.deletePost) {
      return res.status(404).json({
        message: "post not found",
      });
    }

    res.status(200).json({
      message: "post deleted success",
      data: deletedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!id) {
      return res.status(400).json({
        message: "id not found",
      });
    }

    const post = await postModel.findById(id).populate({ path: "user" });
    if (!post) {
      return res.status(400).json({
        message: "post not found",
      });
    }
post.isLiked = post.likedBy.includes(userId);
    res.status(200).json({
      message: "correctly fetched",
      data: mapper(post),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.likedPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!id) {
      return res.status(400).json({
        message: "id not found",
      });
    }
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(400).json({
        message: "post not found",
      });
    }


    if (post.likedBy.includes(userId)) {
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== userId.toString()        
      );
    } else {
      post.likedBy.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: "successfully added ",
      data: mapper(post),
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

