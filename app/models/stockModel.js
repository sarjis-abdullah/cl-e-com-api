const mongoose = require('mongoose');
const { STOCK_STATUS } = require('../enums');

const stockSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    validate: {
      validator: async function(value) {
        const product = await mongoose.model('Product').findById(value);
        return product !== null;
      },
      message: 'Invalid product ID',
    },
  },
  quantity: {
    type: Number,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: STOCK_STATUS,
    required: "In-Stock",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    validate: {
      validator: async function(value) {
        const item = await mongoose.model('User').findById(value);
        return item !== null;
      },
      message: 'Invalid user ID',
    },
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    validate: {
      validator: async function(value) {
        const item = await mongoose.model('User').findById(value);
        return item !== null;
      },
      message: 'Invalid user ID',
    },
  },
  expiredDate: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;