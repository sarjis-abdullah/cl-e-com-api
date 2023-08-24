const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  completed: Joi.boolean(),
});

module.exports = {
  validateCreateTask: (req, res, next) => {
    const { error } = createTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },

  validateUpdateTask: (req, res, next) => {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};
