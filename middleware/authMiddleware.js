const { UserModel } = require("../model/users");
const { decodeToken } = require("../utils/helper");


async function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const userId  = decodeToken(token)
    const user  =  await UserModel.findById(userId)
    if(!user){
      throw 'user not found'
    }
    req.user =  user
    req.userId  =  userId


    next(); 
  } catch  {
    res.status(401).json({error: "Invalid token" });
  }
}
 



async  function isAdmin(req, res, next){
  
 
  try {
    const user  =  req.user
    if(user.role !== "admin") {
      res.status(401).json({ error:"Admins access only" });
    }
      
    next();
  
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }  
}

async function isUser (req, res, next)  {
  
  try {
    const user = req.user
    if(user.role !== "user") {
      res.status(401).json({error : "users only"});
    }

    next();

  
  } catch (error) {
    res.status(500).json({mesage : "server error", error : error.message})
  }
}

module.exports = {verifyToken,isAdmin,isUser};



