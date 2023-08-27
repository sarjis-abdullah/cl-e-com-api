const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  // Other brand-related fields can be added here
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;