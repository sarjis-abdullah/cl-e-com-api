
function brandResource(item) {
  return item
}

function brandResourceCollection(stocks) {
  return stocks.map(stock => brandResource(stock));
}

module.exports = {
  brandResource,
  brandResourceCollection
}