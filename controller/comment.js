const { postModel } = require("../model/post");
const { commentModel } = require("../model/comment");
const { commentCValidator, commentUValidator } = require("../validator/comment");
// const { text } = require("express");
// const { model } = require("mongoose");


const mapper = (entity) => {
  const model = {
    id:entity._id,
    postId: entity.postId,
    text: entity.text,
    userId : entity.userId
  };
  return model;
};


// const commentMapper = (entity) => {
//     const model = {
//         id : entity._id,
//         text : entity.text,
//         postId : entity.postId,


//     }
//     return model;

// }

exports.createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const { error } = commentCValidator.validate(req.body);
    if (error) {
      return res.status(400).json("error ocurred");
    }
    req.body.userId = req.userId;

    if (!postId || !text) {
      return res.status(400).json({
        message: "Post ID and comment text are required",
      });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const newComment = await commentModel.create(req.body);
    res.status(200).json({
      message: " comment Added",
      data: mapper(newComment),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getComment = async (req, res) => {
  try {
    
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }

    const comments = await commentModel
      .find({ postId })
    //   .populate("userId", "name email");

    res.status(200).json({
      message: "Comments fetched successfully",
      data:comments.map(mapper),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { error } = commentUValidator.validate(req.body);
    if (error) {
      return res.status(400).json("error ocurred");
    }
    const { id } = req.params; // Comment ID
    const { text } = req.body;
    const userId = req.userId;

    if (!text) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const comment = await commentModel.findOne({ _id: id, userId });
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you are not authorized to update it",
      });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params; // Comment ID
    const userId = req.userId;

    const comment = await commentModel.findOneAndDelete({ _id: id, userId });
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you are not authorized to delete it",
      });
    }

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
