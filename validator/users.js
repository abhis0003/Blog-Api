const Joi = require("joi");

exports.createValidator = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  email: Joi.string().required(),
  age: Joi.string().required(),
  role: Joi.string().required(),
  password: Joi.string().required(),

});

exports.deleteValidator = Joi.object({
  id : Joi.string().required(),
});

exports.updateValidator = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  age: Joi.string().required(),
});

exports.loginvalidator = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
