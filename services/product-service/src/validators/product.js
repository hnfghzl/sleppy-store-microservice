const Joi = require("joi");

const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().allow("").optional(),
    category: Joi.string().max(100).optional(),
    price: Joi.number().positive().required(),
    features: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string().allow("")
    ).optional(),
    imageUrl: Joi.string().uri().allow("").optional(),
  });
  return schema.validate(data);
};

module.exports = {
  validateProduct,
};
