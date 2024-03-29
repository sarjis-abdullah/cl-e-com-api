const { needToInclude } = require("../utils")
const { userResource } = require("./userResources")

function brandResource(item, query = {}) {
  const {_id, createdAt,updatedAt, name, description} = item
  const data = {
    id: _id, createdAt,updatedAt, name, description
  }

  if (needToInclude(query, 'brand.createdBy')) {
    data.createdBy = item.createdBy ? userResource(item.createdBy) : null
  }
  if (needToInclude(query, 'brand.updatedBy')) {
    data.updatedBy = item.updatedBy ? userResource(item.updatedBy) : null
  }

  return data
}

function brandResourceCollection(items, additionalData = {}, query) {
  const result = items.map(item => brandResource(item, query))
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
  brandResource,
  brandResourceCollection
}