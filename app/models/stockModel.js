const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
  },
  // ...other stock-related fields
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
