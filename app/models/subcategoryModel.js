const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    validate: {
      validator: async function(value) {
        const item = await mongoose.model('Category').findById(value);
        return item !== null;
      },
      message: 'Invalid category ID',
    },
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
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

const Subcategory = mongoose.model('Subcategory', SubcategorySchema);

module.exports = Subcategory;