
const express = require("express");
const {createUser, getUser, deleteUser, updateUser} = require ('../controller/users')
const {verifyToken, isAdmin} = require ('../middleware/authMiddleware')
const router = express.Router();



router.post("/createUser",verifyToken,isAdmin, createUser)
router.get("/getUser",verifyToken, getUser)
router.delete("/deleteUser/:id",verifyToken,isAdmin, deleteUser)
router.put("/updateUser/:id",verifyToken, updateUser)

module.exports = router;