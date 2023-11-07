const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
  address: Joi.string(),
  city: Joi.string(),
  zip: Joi.string(),
  state: Joi.string(),
  type: Joi.string().valid("user", "admin", "customer"),
  password: Joi.string().min(6).required(),
});
const validateUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
  address: Joi.string(),
  city: Joi.string(),
  zip: Joi.string(),
  state: Joi.string(),
  type: Joi.string().valid("user", "admin", "customer"),
  password: Joi.string().min(6).required(),
});

const checkDuplicate = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }],
    });

    if (existingUser) {
      return new Error("eueue");
    }

    next();
  } catch (error) {
    throw error;
  }
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Middleware to check and verify JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  let token = "";
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
const setUserData = (req, res, next) => {
  
  const { method } = req;
  if (method === "POST") {
    req.body.createdBy = req.user.userId;
  } else if (method === "PATCH" || method === "PUT") {
    req.body.updatedBy = req.user.userId;
  }
  // console.log(req.body, 12123);
  next();
};

module.exports = {
  checkDuplicate: async (req, res, next) => {
    try {
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }],
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already exists!" });
      }

      next();
    } catch (error) {
      throw error;
    }
  },
  validateRegistration: (req, res, next) => {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
  validateUpdate: (req, res, next) => {
    const { error } = validateUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
  validateLogin: (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
  auth: authenticateToken,
  setUserData,
};
