const Model = require('../models/stockModel');
const dotenv     = require("dotenv");
const {stockResourceCollection, stockResource} = require("../resources/stockResources");
const Product = require('../models/productModel');
const { getMetaData, needToInclude } = require('../utils');

dotenv.config();

exports.getAll = async (req, res) => {
  try {
    let modelQuery = Model.find({})

    if (needToInclude(req.query, 'stock.brand')) {
      modelQuery = modelQuery.populate('productId');
    }

    if (needToInclude(req.query, 'stock.createdBy')) {
      modelQuery = modelQuery.populate('createdBy');
    }
    if (needToInclude(req.query, 'stock.updatedBy')) {
      modelQuery = modelQuery.populate('updatedBy');
    }

    const items = await modelQuery.exec();

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
    data.sku = data.sku ?? "sku-" + (new Date()).getTime() + Date.now()
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