
function userResource(item) {
  const {_id, createdAt,updatedAt, name, email} = item
  return {
    id: _id, createdAt,updatedAt, name, email
  }
}

function userResourceCollection(items, additionalData = {}, query) {
  const result = items.map(item => userResource(item, query))
  if (Object.keys(additionalData).length) {
    return {
      data: result,
      meta: additionalData
    }
  }
  return result
}

module.exports = {
  userResource,
  userResourceCollection
}