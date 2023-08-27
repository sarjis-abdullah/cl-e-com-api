const mongoose = require('mongoose');

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
  status: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Low Stock'],
    required: true,
  },
  // ...
});


const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;