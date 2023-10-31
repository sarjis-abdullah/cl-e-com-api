const mongoose = require('mongoose');
const Model = require('../models/orderModel');
const dotenv     = require("dotenv");
const { needToInclude, sortAndPagination, getMetaInfo } = require('../utils');
const { orderResourceCollection, orderResource } = require('../resources/orderResources');

dotenv.config();

exports.getAll = async (req, res) => {
  try {
    const pipeline = [];

    if (req.query?.orderBy) {
      const q = {
        $match: {
          orderBy: new mongoose.Types.ObjectId(req.query.orderBy),
        },
      }
      pipeline.push(q)
    }

    if (req.query.searchQuery) {
      // const searchQuery = req.query.searchQuery
      // const sq = {
      //   $match: {
      //     $or: [
      //       { name: { $regex: searchQuery, $options: 'i' } },
      //       { 'stocks.sku': { $regex: searchQuery, $options: 'i' } }, 
      //       { createdBy: { $in: [searchQuery] } },
      //     ],
      //   },
      // }
      // pipeline.push(sq)
    }

    if (needToInclude(req.query, "o.orderBy")) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "orderBy",
          foreignField: "_id",
          as: "orderBy",
        },
      });
    }
    if (needToInclude(req.query, "o.updatedBy")) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedBy",
        },
      });
    }
    if (needToInclude(req.query, "o.products")) {
      pipeline.push({
        $lookup: {
          from: "products", // The name of the Category collection
          localField: "products", // The field in Product that links to Category
          foreignField: "_id", // The field in Category to match with
          as: "products", // The name of the new field to store the category data
        },
      });
    }

    const { sorting, container } = sortAndPagination(req.query);
    pipeline.push(sorting, container);

    const [result] = await Model.aggregate(pipeline);

    const additionalData = getMetaInfo(result, req.query);

    const resources = orderResourceCollection(result.items, additionalData, req.query)
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
    res.status(201).json(orderResource(savedItem, req.query, true));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    let modelQuery = Model.findById(req.params.id)
    if (needToInclude(req.query, 'c.createdBy')) {
      modelQuery = modelQuery.populate('createdBy');
    }
    if (needToInclude(req.query, 'c.updatedBy')) {
      modelQuery = modelQuery.populate('updatedBy');
    }
    
    const item = await modelQuery.exec();
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(orderResource(item, req.query));
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
    res.json(orderResource(item));
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