const Model = require('../models/stockModel');
const dotenv     = require("dotenv");
const {stockResourceCollection, stockResource} = require("../resources/stockResources");
const Product = require('../models/productModel');
const { getMetaData, needToInclude } = require('../utils');

dotenv.config();

exports.getAll = async (req, res) => {
  try {
    let query = Model.find({})

    if (needToInclude(query, 'stock.brand')) {
      query = query.populate('productId');
    }

    const items = await query.exec();

    const additionalData = await getMetaData(Model, req.query)

    const resources = stockResourceCollection(items, additionalData, req.query)
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = {...req.body}
    const item = new Model(data);
    const savedItem = await item.save();

    const product = await Product.findById(data.productId)
    product.stocks.push(savedItem)
    await product.save();

    
    const resource = stockResource(savedItem, req.query)
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Model.findById(req.params.id).populate('productId');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const resource = stockResource(item, req.query)
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const resource = stockResource(item, req.query)
    res.json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};