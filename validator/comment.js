
const Joi = require('joi');




exports.commentCValidator = Joi.object ({
    postId : Joi.string().required(),
    text : Joi.string().required()
})


exports.commentUValidator = Joi.object({
    text : Joi.string().required()
})