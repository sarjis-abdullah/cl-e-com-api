const Model = require('../models/contactModel');
const dotenv     = require("dotenv");

dotenv.config();

exports.getAll = async (req, res) => {
  try {
    const items = await Model.find();
    const response = items
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try { 
    const data = {...req.body}
    const item = new Model(data);
    const savedItem = await item.save();
    
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    let modelQuery = Model.findById(req.params.id)
  
    const item = await modelQuery.exec();
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};