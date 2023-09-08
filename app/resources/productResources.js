const { needToInclude } = require("../utils");
const {brandResource} = require("./brandResources");
const { stockResourceCollection } = require("./stockResources");

function productResource(item, query = {}) {
  const {_id, createdAt,updatedAt, name, description} = item
  const data = {
    id: _id,
    createdAt, updatedAt, name, description
  };

  if (needToInclude(query, 'product.stocks')) {
    data.stocks = stockResourceCollection(item.stocks)
  }
  if (needToInclude(query, 'product.brand')) {
    data.brand = item.brandId ? brandResource(item.brandId) : null
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