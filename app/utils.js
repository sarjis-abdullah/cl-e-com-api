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
function sortAndPaginate(dbQuery, query) {
  const { page, limit } = getPageLimit(query);
  const skip = (page - 1) * limit;

  const sortBy = query?.sortBy == "updatedAt" ? "updatedAt" : "createdAt"
  if (sortBy && query.sortOrder) {
    const sortDirection = query.sortOrder === 'desc' ? -1 : 1;    
    const sort = {};
    sort[sortBy] = sortDirection;
  
    dbQuery = dbQuery.sort(sort);
  }

  return dbQuery.skip(skip).limit(limit)
}

function needToInclude(query, key) {
  if (!query) {
    return false;
  }
  const includeParam = query.include;
  if (!includeParam) {
    return false;
  }
  
  const includedKeys = includeParam.split(',');
  return includedKeys.includes(key);
}

module.exports = {
  getMetaData,
  sortAndPaginate,
  needToInclude
}
