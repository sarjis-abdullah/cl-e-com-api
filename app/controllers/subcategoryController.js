const Model = require('../models/subcategoryModel');
const Category = require('../models/categoryModel');
const dotenv     = require("dotenv");
const { subcategoryResourceCollection } = require('../resources/subcategoryResources.js');
const { getMetaInfo, sortAndPagination, needToInclude } = require('../utils');
const { subcategoryResource } = require('../resources/subcategoryResources');

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

    if (needToInclude(req.query, "s.createdBy")) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      });
    }
    if (needToInclude(req.query, "s.updatedBy")) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedBy",
        },
      });
    }
    if (needToInclude(req.query, "sc.category")) {
      pipeline.push({
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      });
    }

    const { sorting, container } = sortAndPagination(req.query);
    pipeline.push(sorting, container);

    const [result] = await Model.aggregate(pipeline);

    const additionalData = getMetaInfo(result, req.query);

    const resources = subcategoryResourceCollection(result.items, additionalData, req.query)
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
    // const categories = await Category.find({ _id: { $in: [req.body.categoryId] } });
    const category = await Category.findById(req.body.categoryId);
    category.subcategories.push(savedItem)
    res.status(201).json(savedItem);
    // res.status(201).json(subcategoryResource(savedItem));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    let modelQuery = Model.findById(req.params.id)
    if (needToInclude(req.query, 'sc.createdBy')) {
      modelQuery = modelQuery.populate('createdBy');
    }
    if (needToInclude(req.query, 'sc.updatedBy')) {
      modelQuery = modelQuery.populate('updatedBy');
    }
    if (needToInclude(req.query, 'sc.category')) {
      modelQuery = modelQuery.populate('categoryId');
    }
    
    const item = await modelQuery.exec();
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(subcategoryResource(item, req.query));
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
    res.json(subcategoryResource(item));
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