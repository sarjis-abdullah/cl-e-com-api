const { needToInclude } = require("../utils")
const { productResourceCollection } = require("./productResources")
const { userResource } = require("./userResources")

function categoryResource(item, query = {}) {
  const {_id, createdAt,updatedAt, name, description} = item
  const data = {
    id: _id, createdAt,updatedAt, name, description
  }

  if (needToInclude(query, 'brand.createdBy')) {
    data.createdBy = item.createdBy ? userResource(item.createdBy) : null
  }
  if (needToInclude(query, 'category.subcategories')) {
    data.subcategories = item.subcategories ?? null
  }
  if (needToInclude(query, 'brand.updatedBy')) {
    data.updatedBy = item.updatedBy ? userResource(item.updatedBy) : null
  }
  if (needToInclude(query, 'category.products')) {
    data.products = item?.products?.length ? productResourceCollection(item.products) : []
  }

  return data
}

function categoryResourceCollection(items, additionalData = {}, query) {
  const result = items.map(item => categoryResource(item, query))
  if (Object.keys(additionalData).length) {
    return {
      data: result,
      meta: additionalData
    }
  }
  return result
}

module.exports = {
  categoryResource,
  categoryResourceCollection
}