const Joi = require("joi");

const validateOrder = (data) => {
  const schema = Joi.object({
    userId: Joi.number().integer().positive().optional(), // Will be extracted from JWT
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().positive().default(1),
    totalPrice: Joi.number().positive().optional(), // Will be calculated
  });
  return schema.validate(data);
};

const validateOrderStatus = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("pending", "paid", "processing", "completed", "cancelled")
      .required(),
  });
  return schema.validate(data);
};

module.exports = {
  validateOrder,
  validateOrderStatus,
};
