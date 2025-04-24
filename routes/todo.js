const {createTodo, getTodo, updateTodo, deleteTodo, getTodoById} = require("../controller/todo");
const express = require("express");
const {verifyToken}  =  require("../middleware/authMiddleware")
const router = express.Router();



router.post("/createTodo",verifyToken, createTodo)
router.get("/getTodo/:id",verifyToken, getTodo)
router.put("/updateTodo/:id",verifyToken,updateTodo)
router.delete("/deleteTodo/:id",verifyToken,deleteTodo)
router.get("/getTodoById/:id",verifyToken, getTodoById)



module.exports = router;