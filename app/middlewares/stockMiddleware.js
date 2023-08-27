const Joi = require('joi');

const createSchema = Joi.object({
  productId: Joi.string(),
  status: Joi.string(),
  quantity: Joi.number(),
});

const updateSchema = Joi.object({
  productId: Joi.string(),
  status: Joi.string(),
  quantity: Joi.number(),
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
