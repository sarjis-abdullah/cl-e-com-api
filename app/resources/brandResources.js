
function brandResource(item) {
  const {_id, createdAt,updatedAt, name, description} = item
  return {
    id: _id, createdAt,updatedAt, name, description
  }
}

function brandResourceCollection(items, additionalData = {}, query) {
  const result = items.map(item => brandResource(item, query))
  if (Object.keys(additionalData).length) {
    return {
      data: result,
      meta: additionalData
    }
  }
  return result
}

module.exports = {
  brandResource,
  brandResourceCollection
}