const {createPost, getPost, updatePost, deletePost, getPostById, likedPost} = require ('../controller/post')
const express = require("express");
const {verifyToken, isUser} = require ('../middleware/authMiddleware');
const router = express.Router();


router.post("/createPost",verifyToken,isUser,  createPost);
router.get("/getPost",verifyToken,isUser, getPost);
router.put("/updatePost/:id", verifyToken, isUser, updatePost)
router.delete("/deletePost/:id", verifyToken, isUser, deletePost)
router.get("/getPostById/:id", verifyToken, isUser, getPostById)
router.post("/:id/like", verifyToken, isUser, likedPost)



module.exports = router;