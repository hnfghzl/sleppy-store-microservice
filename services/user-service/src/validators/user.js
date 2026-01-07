const Joi = require("joi");

const validateUserUpdate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(255).optional(),
    phone: Joi.string().max(20).allow("").optional(),
    address: Joi.string().allow("").optional(),
  });
  return schema.validate(data);
};

module.exports = {
  validateUserUpdate,
};
