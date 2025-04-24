const express = require("express");
const {verifyToken}  =  require("../middleware/authMiddleware");
const { singleUpload, bulkUpload } = require("../controller/uploads");
const router = express.Router();



router.post("",verifyToken, singleUpload)
router.post("/bulk",verifyToken, bulkUpload)



module.exports = router;