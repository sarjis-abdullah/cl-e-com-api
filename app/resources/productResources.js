const {brandResource} = require("./brandResources")
function productResource(item, query = {}) {
  const product = item
  const data = {
    id: product._id,
    name: product.name,
    description: product.description,
  };

  if (query?.populateStocks == 1) {
    data.stocks = item.stocks
  }
  if (query?.populateBrand == 1) {
    data.brand = brandResource(item.brandId)
  }
  return data
}

function productResourceCollection(products, additionalData, query) {
  return {
    data: products.map(product => productResource(product, query)),
    meta: additionalData
  }
}

module.exports = {
  productResource,
  productResourceCollection
}