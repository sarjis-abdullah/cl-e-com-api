const Model = require("../models/productModel");
const dotenv = require("dotenv");
const {
  productResource,
  productResourceCollection,
} = require("../resources/productResources");
const { getMetaData, sortAndPaginate, needToInclude } = require("../utils");
const Category = require("../models/categoryModel");

dotenv.config();

exports.getAll = async (req, res) => {
  try {
    const pipeline = [];
    const filterWithStocks = req.query.filterWithStocks == "withStocks" ? "withStocks" : "withoutStocks";

    // Match products based on whether they have stocks or not
    if (filterWithStocks === "withStocks") {
      pipeline.push({
        $lookup: {
          from: "stocks", // Name of the Stock collection
          localField: "_id",
          foreignField: "productId",
          as: "stocks",
        },
      });
      pipeline.push({ $match: { "stocks.0": { $exists: true } } });
    } else if (filterWithStocks === "withoutStocks") {
      pipeline.push({
        $lookup: {
          from: "stocks", // Name of the Stock collection
          localField: "_id",
          foreignField: "productId",
          as: "stocks",
        },
      });
      pipeline.push({ $match: { "stocks.0": { $exists: false } } });
    }

    function getPageLimit(query) {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;
      return {
        page,
        limit,
      };
    }

    // Add more lookup stages for other related data (e.g., attachments, categories, createdBy, brand)
    pipeline.push({
      $lookup: {
        from: "attachments", // Name of the Attachment collection
        localField: "attachments",
        foreignField: "_id",
        as: "attachments",
      },
    });
    // Add more lookup stages as needed for other relations

    // Sort and paginate
    function sortAndPagination(query) {
      const { page, limit } = getPageLimit(query);
      const sortBy = query?.sortBy == "updatedAt" ? "updatedAt" : "createdAt";
      const sortDirection = query?.sortDirection === "desc" ? -1 : 1;
      const sorting = { $sort: { [sortBy]: sortDirection } }

      const container = {
        $facet: {
          items: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          totalCount: [
            { $count: 'total' },
          ],
        },
      }
      return {
        sorting,
        container
      }
    }

    const {sorting, container} = sortAndPagination(req.query)
    pipeline.push(sorting)
    pipeline.push(container)
    

    const [result] = await Model.aggregate(pipeline);

    
    function getMetaInfo(result, query) {
      const { page, limit } = getPageLimit(query);
      const total = result.totalCount[0] ? result.totalCount[0].total : 0;
      return {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      }
    }
    const additionalData = getMetaInfo(result, req.query)

    const resources = productResourceCollection(
      result.items,
      additionalData,
      req.query
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
