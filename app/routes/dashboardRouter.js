const express = require('express');
const taskController = require('../controllers/userController');
const { validateLogin, validateRegistration, checkDuplicate, auth } = require('../middlewares/userMiddleware');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find()
    const orders = await Order.find()
    const products = await Product.find()
    res.json([
      {
        total: users.length,
        type: 'user'
      },
      {
        total: orders.length,
        type: 'order',
        totalOrder: orders
      },
      {
        total: products.length,
        type: 'product'
      },
    ])
  } catch (err) {
    res.status(500).json({ error: "Server Error", err });
  }
});

module.exports = router;