const mongoose = require("mongoose");
const { PRODUCT_TYPES } = require("../enums");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
  ],
  attachments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  type: {
    type: String,
    enum: PRODUCT_TYPES,
    default: "Physical",
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
