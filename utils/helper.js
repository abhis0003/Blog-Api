const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret  =  "abhinav"
exports.hashPassword = async (password) => await bcrypt.hash(password, 10);


exports.matchPassword  =  async (password,userPassword)=>await bcrypt.compare(password,userPassword);

exports.generateToken  =  async (userId )=>{
    return jwt.sign({ userId }, secret, {
        expiresIn: '1h',
        });
}

exports.decodeToken  =  (token)=> {
   const decoded =   jwt.verify(token,secret);
   return decoded.userId
}

