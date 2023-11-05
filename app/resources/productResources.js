const { needToInclude } = require("../utils");
const { attachmentResourceCollection } = require("./attachmentResources");
const {brandResource, brandResourceCollection} = require("./brandResources");
const { categoryResourceCollection, categoryResource } = require("./categoryResources");
const { stockResourceCollection } = require("./stockResources");
const { subcategoryResource } = require("./subcategoryResources");
const { userResource, userResourceCollection } = require("./userResources");

function productResource(item, query = {}) {
  const {_id, createdAt,updatedAt, name, description} = item
  const data = {
    id: _id,
    createdAt, updatedAt, name, description
  };
  console.log(data, "data");

  if (needToInclude(query, 'product.stocks')) {
    data.stocks = stockResourceCollection(item.stocks)
  }
  if (needToInclude(query, 'product.brand') && item.brand) {
    data.brand = brandResourceCollection(item.brand)
  }
  if (needToInclude(query, 'product.createdBy')) {
    data.createdBy = item.createdBy ? userResourceCollection(item.createdBy) : null
  }
  if (needToInclude(query, 'product.updatedBy')) {
    data.updatedBy = item.updatedBy ? userResourceCollection(item.updatedBy) : null
  }
  if (needToInclude(query, 'product.category')) {
    const category = item.category?.length ? item.category[0] : item.categoryId
    if (category) {
      data.category = categoryResource(category)
    }
    
  }
  if (needToInclude(query, 'product.attachments')) {
    data.attachments = attachmentResourceCollection(item.attachments)
  }
  if (needToInclude(query, 'product.subcategory')) {
    let sub = {}
    if (item.subcategory?.length) {
      sub = item.subcategory[0]
    } else {
      sub = item.subcategoryId
    }
    data.subcategory = sub? subcategoryResource(sub) : null
  }
  return data
}

function pResource(item, query = {}) {
  const {_id, createdAt,updatedAt, name, description} = item
  const data = {
    id: _id,
    createdAt, updatedAt, name, description
  };

  if (needToInclude(query, 'product.subcategory')) {
    let sub = {}
    if (item.subcategory?.length) {
      sub = item.subcategory[0]
    } else {
      sub = item.subcategoryId
    }
    data.subcategory = subcategoryResource(sub)
  }
  return data
}

function productResourceCollection(items, additionalData, query, wrapData = true) {
  const result = items.map(item => productResource(item, query))
  if (Object.keys(additionalData).length) {
    return {
      data: result,
      meta: additionalData
    }
  }
 
  return !wrapData ? result : {
    data: result
  }
}

module.exports = {
  productResource,
  productResourceCollection,
  pResource
}