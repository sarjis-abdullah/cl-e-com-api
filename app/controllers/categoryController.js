const Model = require('../models/categoryModel');
const dotenv     = require("dotenv");
const { needToInclude, sortAndPagination, getMetaInfo } = require('../utils');
const { categoryResourceCollection, categoryResource } = require('../resources/categoryResources');
const Subcategory = require('../models/subcategoryModel');
const { subcategoryResourceCollection } = require('../resources/subcategoryResources');

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
    }
    if (needToInclude(req.query, "c.subcategories")) {
      pipeline.push({
        $lookup: {
          from: "subcategories", // The name of the Category collection
          localField: "subcategories", // The field in Product that links to Category
          foreignField: "_id", // The field in Category to match with
          as: "subcategories", // The name of the new field to store the category data
        },
      });
    }

    const { sorting, container } = sortAndPagination(req.query);
    pipeline.push(sorting, container);

    const [result] = await Model.aggregate(pipeline);

    const additionalData = getMetaInfo(result, req.query);

    const resources = categoryResourceCollection(result.items, additionalData, req.query)
    const esell = result.items.find(i=>i.name == "E-sell")
    const sortDirection = req.query?.sortDirection === "desc" ? -1 : 1;
    if (esell) {
      if (sortDirection == -1) {
        result.items.push(esell)
      } else {
        result.items.unshift(esell)
      }
      
    }
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
    res.status(201).json(categoryResource(savedItem));
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
    console.log(item, 123);
    res.json(categoryResource(item, req.query));
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
    res.json(categoryResource(item));
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