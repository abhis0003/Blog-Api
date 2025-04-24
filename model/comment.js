const mongoose = require('mongoose');

const commentModel = new mongoose.Schema ({
    
    postId : {type: mongoose.Types.ObjectId, ref: "post"},
    userId : {type : mongoose.Types.ObjectId, ref : "users"},
    text : {type : String, required : true}
})

exports.commentModel = mongoose.model("comment", commentModel)