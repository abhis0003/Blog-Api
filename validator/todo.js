const Joi = require ("joi")

exports.todoValidator = Joi.object({
    title : Joi.string().required(),
    detail : Joi.string().required(),
})


exports.updateValidator = Joi.object({
    title : Joi.string().optional(),
    detail : Joi.string().optional(),
    completed : Joi.boolean().optional()
})