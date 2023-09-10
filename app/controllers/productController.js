const Model = require("../models/productModel");
const dotenv = require("dotenv");
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

exports.getAll = async (req, res) => {
  try {
    const pipeline = [];
    const filterWithStocks =
      req.query.filterWithStocks == "withStocks"
        ? "withStocks"
        : "withoutStocks";

    // if (filterWithStocks === "withStocks") {
    //   pipeline.push({
    //     $lookup: {
    //       from: "stocks",
    //       localField: "_id",
    //       foreignField: "productId",
    //       as: "stocks",
    //     },
    //   });
    //   pipeline.push({ $match: { "stocks.0": { $exists: true } } });
    // } else if (filterWithStocks === "withoutStocks") {
    //   pipeline.push({
    //     $lookup: {
    //       from: "stocks",
    //       localField: "_id",
    //       foreignField: "productId",
    //       as: "stocks",
    //     },
    //   });
    //   pipeline.push({ $match: { "stocks.0": { $exists: false } } });
    // }

    // Add more lookup stages for other related data (e.g., attachments, categories, createdBy, brand)

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
      console.log(393939);
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
    if (needToInclude(req.query, "product.categories")) {
      pipeline.push({
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "products",
          as: "categories",
        },
      });
      // pipeline.push({
      //   $unwind: "$categories",  // Unwind the "categories" array to destructure it
      // });
      
      
    }
    if (needToInclude(req.query, "product.attachments")) {
      pipeline.push({
        $lookup: {
          from: "attachments",
          localField: "_id",
          foreignField: "productId",
          as: "attachments",
        },
      });
    }

    const { sorting, container } = sortAndPagination(req.query);
    pipeline.push(sorting);
    pipeline.push(container);

    const [result] = await Model.aggregate(pipeline);

    const additionalData = getMetaInfo(result, req.query);

    const resources = productResourceCollection(
      result.items,
      additionalData,
      req.query
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
    const item = new Model(data);

    // Todo
    // const ids = req.body.categories
    // const categories = await Category.find({ '_id': { $in: ids } });
    const newProduct = await item.save();
    const resource = productResource(newProduct, req.query);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Model.findById(req.params.id).populate("categories");
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
