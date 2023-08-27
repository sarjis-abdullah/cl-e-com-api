const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
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
