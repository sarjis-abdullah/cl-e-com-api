
function brandResource(item) {
  const {_id, createdAt,updatedAt, name, description} = item
  return {
    id: _id, createdAt,updatedAt, name, description
  }
}

function brandResourceCollection(stocks) {
  return stocks.map(stock => brandResource(stock));
}

module.exports = {
  brandResource,
  brandResourceCollection
}