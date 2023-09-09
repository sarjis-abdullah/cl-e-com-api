const Model = require('../models/attachmentModel');
const dotenv     = require("dotenv");
const { needToInclude, sortAndPaginate, getMetaData } = require('../utils');
const { attachmentResourceCollection, attachmentResource } = require('../resources/attachmentResources');

dotenv.config();

exports.getAll = async (req, res) => {
  try {
    let modelQuery = Model.find({})

    if (needToInclude(req.query, 'attachment.createdBy')) {
      modelQuery = modelQuery.populate('createdBy');
    }

    modelQuery = sortAndPaginate(modelQuery, req.query);

    const items = await modelQuery.exec();
    
    const additionalData = await getMetaData(Model, req.query)
   
    const resources = attachmentResourceCollection(items, additionalData, req.query)
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
    res.status(201).json(attachmentResource(savedItem));
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

    res.json(attachmentResource(item));
  } catch (err) {
    res.status(500).json({ error: err.message });
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