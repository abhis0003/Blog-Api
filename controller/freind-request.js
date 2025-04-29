const { friendRequestModel } = require("../model/friend-request");
const { UserModel } = require("../model/users");
const { sentRqstValidator } = require("../validator/friend-request");

const mapper = (entity) => {
  const model = {
    id: entity._id,
    senderId: entity.senderId,
    recieverId: entity.recieverId,
    status: entity.status,
  };
  return model;
};

exports.createRequest = async (req, res) => {
  const { error } = sentRqstValidator.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "error occured",
    });
  }

  try {
    const { recieverId } = req.body;
    const userId = req.userId;

    if (userId === recieverId) {
      return res.status(400).json({
        message:
          " ! sender & reciever id seems to be same please try a different reciver's Id ",
      });
    }

    const receiver = await UserModel.findById(recieverId);
    if (!receiver) {
      return res.status(400).json({
        message: "please enter a reciever id",
      });
    }

    const existingRequest = await friendRequestModel.findOne({
      $or: [
        { senderId: userId, recieverId: recieverId },
        { senderId: recieverId, recieverId: userId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Friend request already exists",
      });
    }
    const newRequest = await friendRequestModel.create({
      senderId: userId,
      recieverId,
    });

    res.status(200).json({
      message: "request sent success ",
      data: mapper(newRequest),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await friendRequestModel.find({
      recieverId: userId,
      status: "pending",
    });

    res.status(200).json({
      message: "Friend requests retrieved successfully",
      data: requests?.map(mapper),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.respondToRequest = async (req, res) => {
  const requestId = req.params.id
  const {status} = req.body;
  

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Please Accept or Reject",
    });
  }

  try {
    const request = await friendRequestModel.findById(requestId);

    if (!request) {
      return res.status(400).json({
        message: "please provide a valid status",
      });
    }

    request.status = status;
    await request.save();

    return res.status(200).json({
      message: "success"
    })


  } catch (error) {
    return res.status(500).json({
      message: "Internal Servor Error",
      error: error.message,
    });
  }
};


exports.friendList = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all accepted friend requests where the user is either the sender or receiver
    const friends = await friendRequestModel.find({
      $or: [{ senderId: userId, status: "accepted" }, { recieverId: userId, status: "accepted" }],
    });

    // Map the results to include only relevant information
    const friendList = friends.map((request) => {
      return request.senderId.toString() === userId
        ? { friendId: request.recieverId, status: request.status }
        : { friendId: request.senderId, status: request.status };
    });

    res.status(200).json({
      message: "Friend list retrieved successfully",
      data: friendList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Servor Error",
      error: error.message,
    })
}}

exports.deleteFriend = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.params;

    // Find and delete the friend request where the user is either the sender or receiver
    const deletedRequest = await friendRequestModel.findOneAndDelete({
      $or: [
        { senderId: userId, recieverId: friendId, status: "accepted" },
        { senderId: friendId, recieverId: userId, status: "accepted" },
      ],
    });

    if (!deletedRequest) {
      return res.status(404).json({
        message: "Friend not found or already removed",
      });
    }

    res.status(200).json({
      message: "Friend removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const userId = req.userId;
    const friendId = req.params.id;

    // Find and remove the friend request where the user is either the sender or receiver
    const removedRequest = await friendRequestModel.findOneAndDelete({
      $or: [
        { senderId: userId, recieverId: friendId, status: "accepted" },
        { senderId: friendId, recieverId: userId, status: "accepted" },
      ],
    });

    if (!removedRequest) {
      return res.status(404).json({
        message: "Friend not found or already removed",
      });
    }

    res.status(200).json({
      message: "Friend removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};