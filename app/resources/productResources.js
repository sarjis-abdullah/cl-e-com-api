const { needToInclude } = require("../utils");
const { attachmentResourceCollection } = require("./attachmentResources");
const {brandResource, brandResourceCollection} = require("./brandResources");
const { categoryResourceCollection } = require("./categoryResources");
const { stockResourceCollection } = require("./stockResources");
const { userResource, userResourceCollection } = require("./userResources");

function productResource(item, query = {}) {
  const {_id, createdAt,updatedAt, name, description, type} = item
  const data = {
    id: _id,
    createdAt, updatedAt, name, description, type
  };

  if (needToInclude(query, 'product.stocks')) {
    data.stocks = stockResourceCollection(item.stocks)
  }
  if (needToInclude(query, 'product.brand') && item.brand) {
    data.brand = brandResourceCollection(item.brand)
  }
  if (needToInclude(query, 'product.createdBy')) {
    data.createdBy = item.createdBy ? userResourceCollection(item.createdBy) : null
  }
  if (needToInclude(query, 'product.updatedBy')) {
    data.updatedBy = item.updatedBy ? userResourceCollection(item.updatedBy) : null
  }
  if (needToInclude(query, 'product.categories')) {
    data.categories = categoryResourceCollection(item.categories)
  }
  if (needToInclude(query, 'product.attachments')) {
    data.attachments = attachmentResourceCollection(item.attachments)
  }
  return data
}

function productResourceCollection(items, additionalData, query) {
  const result = items.map(item => productResource(item, query))
  if (Object.keys(additionalData).length) {
    return {
      data: result,
      meta: additionalData
    }
  }
  return {
    data: result
  }
}

module.exports = {
  productResource,
  productResourceCollection
}