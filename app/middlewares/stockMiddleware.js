const Joi = require('joi');

const createSchema = Joi.object({
  productId: Joi.string().required(),
  status: Joi.string().required(),
  quantity: Joi.number().required(),
  sku: Joi.string(),
  purchasePrice: Joi.number().required(),
  sellingPrice: Joi.number().required(),
  expiredDate: Joi.date().required(),
});

const updateSchema = Joi.object({
  productId: Joi.string().required(),
  status: Joi.string().required(),
  quantity: Joi.number().required(),
  sku: Joi.string(),
  purchasePrice: Joi.number().required(),
  sellingPrice: Joi.number().required(),
  expiredDate: Joi.date().required(),
});

module.exports = {
  validateCreateItem: (req, res, next) => {
    const { error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },

  validateUpdateItem: (req, res, next) => {
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};
