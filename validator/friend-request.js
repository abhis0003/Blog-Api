const Joi = require('joi');

exports.sentRqstValidator = Joi.object({
    recieverId : Joi.string().required(),
  
})