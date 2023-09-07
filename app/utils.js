function getPageLimit(query){
  const page = parseInt(query.page) || 1; 
  const limit = parseInt(query.limit) || 10;
  return {
    page, limit
  }
}
async function getMetaData(Model, query) {
  const { page, limit } = getPageLimit(query);
  const count = await Model.countDocuments();
  return {
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  };
}
function setPagination(dbQuery, query) {
  const { page, limit } = getPageLimit(query);
  const skip = (page - 1) * limit;
  return dbQuery.skip(skip).limit(limit)
}

module.exports = {
  getMetaData,
  setPagination
}
