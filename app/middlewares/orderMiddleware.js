const Joi = require('joi');

const orderValidationSchema = Joi.object({
  orderBy: Joi.string().required(),
  shippingAddress: Joi.string().required(),
  billingAddress: Joi.string().required(),
  orderStatus: Joi.string().valid('pending', 'processing', 'shipped', 'delivered').default('pending'),
  paymentMethod: Joi.string().valid('card', 'cash').default('card'),
  paymentStatus: Joi.string().valid('paid', 'pending', 'failed').default('pending'),
  shippingMethod: Joi.string().allow(''),
  subtotal: Joi.number().required(),
  tax: Joi.number().allow(''),
  shippingCost: Joi.number().allow(''),
  totalCost: Joi.number().required(),
  products: Joi.array().items(Joi.string()).default([]),
  discountCode: Joi.string().allow(''),
  orderNotes: Joi.string().allow(''),
  trackingNumber: Joi.string().allow(''),
  returnRefundStatus: Joi.string().allow(''),
});

// module.exports = orderValidationSchema;

module.exports = {
  orderValidationSchema: (req, res, next) => {
    const { error } = orderValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};