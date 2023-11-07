const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().allow(''),
  phone: Joi.string().allow(''),
  description: Joi.string().allow(''),
});

module.exports = {
  validateCreateItem: (req, res, next) => {
    const { error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};
