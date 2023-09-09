
const { needToInclude } = require("../utils");
const {productResource} = require("./productResources")
function stockResource(item, query) {
  const {_id, createdAt,updatedAt, productId, status, quantity} = item
  const data = {
    id: _id,
    createdAt,
    updatedAt,
    quantity,
    status,
    sku,
    sellingPrice,
    purchasePrice,
    expiredDate
  };

  if (needToInclude(query, 'stock.product')) {
    data.product = productResource(productId)
  }
  if (needToInclude(query, 'stock.brand')) {
    data.brand = item.brandId ? brandResource(item.brandId) : null
  }
  return data
}

function stockResourceCollection(items, additionalData = {}, query) {
  const result = items.map(item => stockResource(item, query))
  if (Object.keys(additionalData).length) {
    return {
      data: result,
      meta: additionalData
    }
  }
  return result
}

module.exports = {
  stockResource,
  stockResourceCollection
}