function productResource(item) {
  const product = item
  const data = {
    id: product._id,
    name: product.name,
    description: product.description,
  };

  if (true) {
    data.stocks = item.stocks
  }
  return data
}

function productResourceCollection(products) {
  return products.map(product => productResource(product));
}

module.exports = {
  productResource,
  productResourceCollection
}