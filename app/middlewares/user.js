const Joi = require("joi");
const User = require("../models/userModel");

const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const checkDuplicate = async(req, res, next) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }],
    });

    if (existingUser) {
      return new Error("eueue")
    }

    next();
  } catch (error) {
    throw error
  }
}

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  checkDuplicate: async(req, res, next) => {
    try {
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }],
      });
  
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists!" });
      }
  
      next();
    } catch (error) {
      throw error
    }
  },
  validateRegistration: (req, res, next) => {
    const {error} = userRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
  validateLogin: (req, res, next) => {
    const {error} = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};
