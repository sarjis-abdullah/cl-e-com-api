const Model = require("../models/productModel");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const {
  productResource,
  productResourceCollection,
} = require("../resources/productResources");
const {
  getMetaData,
  sortAndPaginate,
  needToInclude,
  sortAndPagination,
  getMetaInfo,
} = require("../utils");
const Category = require("../models/categoryModel");

dotenv.config();

function filterProductByStocks(query) {
  const pipeline = [];
  const filterWithStocks =
    query.filterWithStocks == "withStocks" ? "withStocks" : "withoutStocks";

  if (filterWithStocks === "withStocks") {
    pipeline.push({
      $lookup: {
        from: "stocks",
        localField: "_id",
        foreignField: "productId",
        as: "stocks",
      },
    });
    pipeline.push({ $match: { "stocks.0": { $exists: true } } });
  } else if (filterWithStocks === "withoutStocks") {
    pipeline.push({
      $lookup: {
        from: "stocks",
        localField: "_id",
        foreignField: "productId",
        as: "stocks",
      },
    });
    pipeline.push({ $match: { "stocks.0": { $exists: false } } });
  }
  return pipeline;
}

exports.getAll = async (req, res) => {
  try {
    const fs = req.query?.filterWithStocks
    const pipeline = fs ? filterProductByStocks(req.query) : [];

    if (req.query?.createdBy) {
      const q = {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.query.createdBy),
        },
      }
      pipeline.push(q)
    }

    if (req.query?.subcategoryId) {
      const q = {
        $match: {
          subcategoryId: new mongoose.Types.ObjectId(req.query.subcategoryId),
        },
      }
      pipeline.push(q)
    }
    if (req.query?.categoryId) {
      const q = {
        $match: {
          categoryId: new mongoose.Types.ObjectId(req.query.categoryId),
        },
      }
      pipeline.push(q)
    }

    if (req.query?.productId) {
      const q = {
        $match: {
          _id: new mongoose.Types.ObjectId(req.query.productId),
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

    if (needToInclude(req.query, "product.brand")) {
      pipeline.push({
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      });
    }
    if (needToInclude(req.query, "product.stocks")) {
      pipeline.push({
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "productId",
          as: "stocks",
        },
      });
    }

    if (needToInclude(req.query, "product.createdBy")) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      });
    }
    if (needToInclude(req.query, "product.updatedBy")) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedBy",
        },
      });
    }
    if (needToInclude(req.query, "product.category")) {
      pipeline.push({
        $lookup: {
          from: "categories", // The name of the Category collection
          localField: "categoryId", // The field in Product that links to Category
          foreignField: "_id", // The field in Category to match with
          as: "category", // The name of the new field to store the category data
        },
      });
    }
    if (needToInclude(req.query, "product.attachments")) {
      pipeline.push({
        $lookup: {
          from: "attachments",
          localField: "attachments",
          foreignField: "_id",
          as: "attachments",
        },
      });
    }
    if (needToInclude(req.query, "product.subcategory")) {
      pipeline.push({
        $lookup: {
          from: "subcategories",
          localField: "subcategoryId",
          foreignField: "_id",
          as: "subcategory",
        },
      });
    }

    const { sorting, container } = sortAndPagination(req.query);
    pipeline.push(sorting, container);

    const [result] = await Model.aggregate(pipeline);

    const additionalData = getMetaInfo(result, req.query);
    // res.json(result.items);
    // return
    // console.log(result.items, "result.items");
    const resources = productResourceCollection(
      result.items,
      additionalData,
      req.query,
    );

    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
    const item = new Model(data);
    const newProduct = await item.save();
    const resource = productResource(newProduct, req.query);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    let modelQuery = Model.findOne({_id: req.params.id})
    if (needToInclude(req.query, "product.category")){
      modelQuery = modelQuery.populate("categoryId");
    }
    if (needToInclude(req.query, "product.subcategory")){
      modelQuery = modelQuery.populate("subcategoryId");
    }
    if (needToInclude(req.query, "product.stocks")){
      modelQuery = modelQuery.populate("stocks");
    }
    if (needToInclude(req.query, "product.attachments")){
      modelQuery = modelQuery.populate("attachments");
    }
    
    const item = await modelQuery.exec();
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    const resource = productResource(item, req.query);
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
      return res.status(404).json({ message: "Item not found" });
    }
    const resource = productResource(item);
    res.json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
