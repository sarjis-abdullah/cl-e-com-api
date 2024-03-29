const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  brandId: Joi.string().allow(''),
  categoryId: Joi.string().required(),
  subcategoryId: Joi.string().allow(null),
  attachments: Joi.array(),
  type: Joi.string().valid('Physical', 'Online'),
});

const updateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  brandId: Joi.string().allow(''),
  subcategoryId: Joi.string().allow(null),
  categoryId: Joi.string().required(),
  attachments: Joi.array(),
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
