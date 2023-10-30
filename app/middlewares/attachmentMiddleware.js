const Joi = require('joi');

const createSchema = Joi.object({
  type: Joi.string().required(),
  fileSource: Joi.required(),
});

const ALLOWED_TYPES = ['application/pdf', 'image/jpg', 'image/png']

const fileSchema = Joi.object({
  fileSource: Joi.object()
    .required()
    .keys({
      mimetype: Joi.string()
        .valid(...ALLOWED_TYPES)
        .required(),
      size: Joi.number()
        .max(5 * 1024 * 1024)
        .required(),
    }),
});

module.exports = {
  validateCreateItem: (req, res, next) => {
    // return res.status(400).json({ error: res.file, body: req.body });
    const response = fileSchema.validate({ fileSource: req.fileSource });
    if (response.error) {
      const error = response.error
      return res.status(400).json({ error: error.details[0].message });
    }

    const {error} = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    next();
  },
};
