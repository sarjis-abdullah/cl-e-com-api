const Joi = require('joi');
const PRODUCT_TYPES = require("")

const createSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
  brandId: Joi.string().required(),
  categories: Joi.array().required(),
  attachments: Joi.array().required(),
  type: Joi.string().valid('Physical', 'Online'),
});

const updateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
  brandId: Joi.string().required(),
  categories: Joi.array().required(),
  attachments: Joi.array().required(),
  type: Joi.string().valid('Physical', 'Online'),
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
