const { needToInclude } = require("../utils");
const { attachmentResourceCollection } = require("./attachmentResources");
const {brandResource} = require("./brandResources");
const { categoryResourceCollection } = require("./categoryResources");
const { stockResourceCollection } = require("./stockResources");
const { userResource } = require("./userResources");

function productResource(item, query = {}) {
  const {_id, createdAt,updatedAt, name, description, type} = item
  const data = {
    id: _id,
    createdAt, updatedAt, name, description, type
  };

  if (needToInclude(query, 'product.stocks')) {
    data.stocks = stockResourceCollection(item.stocks)
  }
  if (needToInclude(query, 'product.brand')) {
    data.brand = item.brand ? brandResource(item.brand) : null
  }
  if (needToInclude(query, 'product.createdBy')) {
    data.createdBy = item.createdBy ? userResource(item.createdBy) : null
  }
  if (needToInclude(query, 'product.updatedBy')) {
    data.updatedBy = item.updatedBy ? userResource(item.updatedBy) : null
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
  return result
}

module.exports = {
  productResource,
  productResourceCollection
}