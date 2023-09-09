const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
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
