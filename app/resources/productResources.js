function productResource(item) {
  const product = item
  return {
    id: product._id,
    name: product.name,
    description: product.description,
  };
}

function productResourceCollection(products) {
  return products.map(product => productResource(product));
}

module.exports = {
  productResource,
  productResourceCollection
}