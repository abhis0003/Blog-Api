const {createComment, getComment, deleteComment, updateComment} = require('../controller/comment');

const express = require ('express');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();


router.post("/createComment",verifyToken, createComment)
router.get("/getComment/:postId",verifyToken, getComment)
router.delete("/deleteComment",verifyToken, deleteComment)
router.put("/updateComment/:id",verifyToken, updateComment)



module.exports  =  router