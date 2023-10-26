const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  ],
  // subcategories: [
  //   { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }
  // ],
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

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;