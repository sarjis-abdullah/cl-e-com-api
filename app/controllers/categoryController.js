const Model = require('../models/categoryModel');
const dotenv     = require("dotenv");
const { getMetaData, needToInclude, sortAndPaginate, sortAndPagination, getMetaInfo } = require('../utils');
const { categoryResourceCollection } = require('../resources/categoryResources');

dotenv.config();

exports.getAll = async (req, res) => {
  try {
    const pipeline = [];

    if (req.query?.createdBy) {
      const q = {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.query.createdBy),
        },
      }
      pipeline.push(q)
    }

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery
      const sq = {
        $match: {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { 'stocks.sku': { $regex: searchQuery, $options: 'i' } }, 
            { createdBy: { $in: [searchQuery] } },
          ],
        },
      }
      pipeline.push(sq)
    }

    if (needToInclude(req.query, "category.createdBy")) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      });
    }
    if (needToInclude(req.query, "category.updatedBy")) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedBy",
        },
      });
    }
    if (needToInclude(req.query, "category.products")) {
      pipeline.push({
        $lookup: {
          from: "products", // The name of the Category collection
          localField: "products", // The field in Product that links to Category
          foreignField: "_id", // The field in Category to match with
          as: "products", // The name of the new field to store the category data
        },
      });
      console.log(pipeline, 19181);
    }

    const { sorting, container } = sortAndPagination(req.query);
    pipeline.push(sorting, container);

    const [result] = await Model.aggregate(pipeline);

    const additionalData = getMetaInfo(result, req.query);

    const resources = categoryResourceCollection(result.items, additionalData, req.query)
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
    res.status(201).json(savedItem);
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

    res.json(item);
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
    res.json(item);
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