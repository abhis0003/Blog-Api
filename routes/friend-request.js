const express = require('express');
const {createRequest, getRequests, respondToRequest, friendList, removeFriend} = require ('../controller/freind-request')
const router = express.Router()
const {verifyToken} = require ('../middleware/authMiddleware')
 


router.post("/createRequest/", verifyToken, createRequest)
router.get("/getRequests", verifyToken, getRequests)
router.put("/respondToRequest/:id", verifyToken, respondToRequest)
router.get("/friendList", verifyToken, friendList)
router.delete("/removeFriend/:id", verifyToken, removeFriend)

module.exports = router