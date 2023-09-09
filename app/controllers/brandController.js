const Model = require('../models/brandModel');
const dotenv     = require("dotenv");
const { brandResourceCollection, brandResource } = require('../resources/brandResources');
const { getMetaData, needToInclude, setPagination } = require('../utils');

dotenv.config();

exports.getAll = async (req, res) => {
  try {
    let modelQuery = Model.find({})

    if (needToInclude(req.query, 'stock.createdBy')) {
      modelQuery = modelQuery.populate('createdBy');
    }
    if (needToInclude(req.query, 'stock.updatedBy')) {
      modelQuery = modelQuery.populate('updatedBy');
    }

    modelQuery = setPagination(modelQuery, req.query);

    const items = await modelQuery.exec();
    
    const additionalData = await getMetaData(Model, req.query)
   
    const resources = brandResourceCollection(items, additionalData, req.query)

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
    res.status(201).json(brandResource(savedItem));
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

    res.json(savedItem(item));
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
    res.json(savedItem(item));
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