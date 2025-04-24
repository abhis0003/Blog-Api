const Joi = require ("joi");


exports.createPValidator = Joi.object ({
    title : Joi.string().required(),
    description : Joi.string().required(),
    
    
})

exports.upadtePValidator = Joi.object({
    title : Joi.string().optional(),
    description : Joi.string().optional(),
   
})



