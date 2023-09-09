const { needToInclude } = require("../utils")
const { userResource } = require("./userResources")

function attachmentResource(item, query = {}) {
  const {_id, createdAt,mimeType,type,fileName,resourceId } = item
  const data = {
    id: _id, createdAt,mimeType,type,fileName,resourceId
  }

  if (needToInclude(query, 'brand.createdBy')) {
    data.createdBy = item.createdBy ? userResource(item.createdBy) : null
  }

  return data
}

function attachmentResourceCollection(items, additionalData = {}, query) {
  const result = items.map(item => attachmentResource(item, query))
  if (Object.keys(additionalData).length) {
    return {
      data: result,
      meta: additionalData
    }
  }
  return result
}

module.exports = {
  attachmentResource,
  attachmentResourceCollection
}