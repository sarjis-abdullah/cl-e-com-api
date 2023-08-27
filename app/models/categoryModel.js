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
  // Other Category-related fields can be added here
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;