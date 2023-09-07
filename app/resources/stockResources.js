
const {productResource} = require("./productResources")
function stockResource(item, query) {
  const {_id, createdAt,updatedAt, productId, status, quantity} = item
  const data = {
    id: _id,
    createdAt,
    updatedAt,
    quantity,
    status,
  };

  if (query.populateProduct == 1) {
    data.product = productResource(productId)
  }
  return data
}

function stockResourceCollection(stocks, additionalData = {}, query) {
  return {
    data: stocks.map(stock => stockResource(stock, query)),
    meta: additionalData
  }
}

module.exports = {
  stockResource,
  stockResourceCollection
}