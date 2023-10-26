const { needToInclude } = require("../utils")
const { categoryResource, categoryResourceCollection } = require("./categoryResources")
const { userResource } = require("./userResources")

function subcategoryResource(item, query = {}) {
  const {_id, createdAt,updatedAt, name, description} = item
  const data = {
    id: _id, createdAt,updatedAt, name, description
  }

  if (needToInclude(query, 'sc.createdBy')) {
    data.createdBy = item.createdBy ? userResource(item.createdBy, query) : null
  }
  if (needToInclude(query, 'sc.updatedBy')) {
    data.updatedBy = item.updatedBy ? userResource(item.updatedBy, query) : null
  }
  if (needToInclude(query, 'sc.category')) {
    data.category = item.categoryId
    // data.category = item.categoryId ? categoryResource(item.categoryId) : null
  }

  return data
}

function subcategoryResourceCollection(items, additionalData = {}, query) {
  console.log(query, "query");
  const result = items.map(item => subcategoryResource(item, query))
  if (Object.keys(additionalData).length) {
    return {
      data: result,
      meta: additionalData
    }
  }
  return {
    data: result
  }
}

module.exports = {
  subcategoryResource,
  subcategoryResourceCollection
}