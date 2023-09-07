
const {stockResource} = require("./stockResources")
function stockResource(item) {
  const {_id, createdAt, productId, status, quantity} = item
  const data = {
    id: _id,
    createdAt,
    updatedAt,
    quantity,
    status,
  };

  if (true) {
    data.product = productResource(productId)
  }
  return data
}

function stockResourceCollection(stocks) {
  return stocks.map(stock => stockResource(stock));
}

module.exports = {
  stockResource,
  stockResourceCollection
}