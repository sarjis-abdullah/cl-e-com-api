const {brandResource} = require("./brandResources");
const { stockResourceCollection } = require("./stockResources");
function productResource(item, query = {}) {
  const product = item
  const data = {
    id: product._id,
    name: product.name,
    description: product.description,
  };

  if (query?.populateStocks == 1) {
    data.stocks = stockResourceCollection(item.stocks)
  }
  if (query?.populateBrand == 1) {
    data.brand = brandResource(item.brandId)
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