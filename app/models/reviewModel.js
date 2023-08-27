const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  // Other Review-related fields can be added here
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;