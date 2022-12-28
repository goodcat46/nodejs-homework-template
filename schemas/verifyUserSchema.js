const Joi = require("joi");
const emailRegExp = /[\w-]+@([\w-]+\.)+[\w-]+/;

const verifyUserSchema = (param) => {
  if (param === "verificationToken") {
    return Joi.object({
      verificationToken: Joi.string().required(),
    });
  }
  if (param === "email") {
    return Joi.object({
      email: Joi.string().pattern(emailRegExp).required(),
    });
  }
};

module.exports = { verifyUserSchema };
