const { needToInclude } = require("../utils");
const { productResourceCollection } = require("./productResources");
const { userResource } = require("./userResources");

function orderResource(item, query = {}, wrapData = false) {
  const {
    _id,
    createdAt,
    updatedAt,
    orderBy,
    shippingAddress,
    billingAddress,
    orderStatus,
    paymentMethod,
    paymentStatus,
    subtotal,
    tax,
    shippingCost,
    totalCost,
    discountCode,
    orderNotes,
    trackingNumber,
    returnRefundStatus,
  } = item;
  const data = {
    id: _id,
    createdAt,
    updatedAt,
    shippingAddress,
    billingAddress,
    orderStatus,
    paymentMethod,
    paymentStatus,
    subtotal,
    tax,
    shippingCost,
    totalCost,
    discountCode,
    orderNotes,
    trackingNumber,
    returnRefundStatus,
  };

  if (needToInclude(query, "o.orderBy")) {
    let orderBy = {}
    if (item.orderBy?.length) {
      orderBy = item.orderBy[0]
    } else {
      orderBy = item.orderBy
    }
    data.orderBy = userResource(orderBy)
  }

  if (needToInclude(query, "o.updatedBy")) {
    let updatedBy = {}
    if (item.updatedBy?.length) {
      updatedBy = item.updatedBy[0]
    } else {
      updatedBy = item.updatedBy
    }
    data.updatedBy = userResource(updatedBy)
  }
  if (needToInclude(query, "o.products")) {
    data.products = item?.products?.length
      ? productResourceCollection(item.products, {}, query, false)
      : [];
  }
 

  return wrapData ? { data } : data;
}

function orderResourceCollection(items, additionalData = {}, query) {
  const result = items.map((item) => orderResource(item, query, false));
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
