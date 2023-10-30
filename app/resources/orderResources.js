const { needToInclude } = require("../utils");
const { productResourceCollection } = require("./productResources");
const { userResource } = require("./userResources");

function orderResource(item, query = {}, fromCollection = false) {
  const data = {
    id: item._id,
    ...item,
  };

  if (needToInclude(query, "o.orderBy")) {
    data.orderBy = item.orderBy ? userResource(item.orderBy) : null;
  }

  if (needToInclude(query, "o.updatedBy")) {
    data.updatedBy = item.updatedBy ? userResource(item.updatedBy) : null;
  }
  if (needToInclude(query, "o.products")) {
    data.products = item?.products?.length
      ? productResourceCollection(item.products)
      : [];
  }
  if (!fromCollection) {
    return { data };
  }

  return data;
}

function orderResourceCollection(items, additionalData = {}, query) {
  const result = items.map((item) => orderResource(item, query, true));
  if (Object.keys(additionalData).length) {
    return {
      data: result,
      meta: additionalData,
    };
  }
  return {
    data: result,
  };
}

module.exports = {
  orderResource,
  orderResourceCollection,
};
