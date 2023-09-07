const Model = require('../models/productModel');
const dotenv     = require("dotenv");
const { productResource, productResourceCollection } = require('../resources/productResources');
const { getMetaData, setPagination } = require('../utils');

dotenv.config();

exports.getAll = async (req, res) => {
  try {
    let modelQuery = Model.find({})

    if (req.query.populateBrand == 1) {
      modelQuery = modelQuery.populate('brandId');
    }
    if (req.query.populateStocks == 1) {
      modelQuery = modelQuery.populate('stocks');
    }

    modelQuery = setPagination(modelQuery, req.query);

    const items = await modelQuery.exec();
    
    const additionalData = await getMetaData(Model, req.query)
   
    const resources = productResourceCollection(items, additionalData, req.query)

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
    const resource = productResource(savedItem, req.query)
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Model.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const resource = productResource(item)
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
    const resource = productResource(item)
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