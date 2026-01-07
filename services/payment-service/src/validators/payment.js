const Joi = require("joi");

const validatePayment = (data) => {
  const schema = Joi.object({
    userId: Joi.number().integer().positive().required(),
    orderId: Joi.number().integer().positive().required(),
    amount: Joi.number().positive().required(),
    paymentMethod: Joi.string()
      .valid("credit_card", "bank_transfer", "e-wallet", "virtual_account")
      .required(),
  });
  return schema.validate(data);
};

module.exports = {
  validatePayment,
};
