const Model = require('../models/productModel');
const dotenv     = require("dotenv");
const { productResource, productResourceCollection } = require('../resources/productResources');

dotenv.config();

exports.getAll = async (req, res) => {
  try {

    let query = Model.find({})

    if (req.query.populateBrand == 1) {
      query = query.populate('brandId');
    }
    query = query.populate('stocks');

    const items = await query.exec();
    const { page = 1, limit = 10 } = req.query;

    // let items = await Model.find({})
                              // // We multiply the "limit" variables by one just to make sure we pass a number and not a string
                              // .limit(limit * 1)
                              // // I don't think i need to explain the math here
                              // .skip((page - 1) * limit)
                              // // We sort the data by the date of their creation in descending order (user 1 instead of -1 to get ascending order)
                              // .sort({ createdAt: -1 })
                              // .populate('stocks');
    
    const count = await Model.countDocuments();
    const additionalData = {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    }
   
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