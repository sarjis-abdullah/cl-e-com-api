const { needToInclude } = require("../utils")
const { productResourceCollection } = require("./productResources")
const { subcategoryResourceCollection } = require("./subcategoryResources")
const { userResource } = require("./userResources")

function categoryResource(item, query = {}) {
  const {_id, createdAt,updatedAt, name, description} = item
  const data = {
    id: _id, createdAt,updatedAt, name, description
  }

  if (needToInclude(query, 'c.createdBy')) {
    data.createdBy = item.createdBy ? userResource(item.createdBy) : null
  }
  if (needToInclude(query, 'c.subcategories')) {
    console.log(item.subcategories, "subcategories");
    data.subcategories = item.subcategories?.length ? subcategoryResourceCollection(item.subcategories) : []
  }
  if (needToInclude(query, 'c.updatedBy')) {
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