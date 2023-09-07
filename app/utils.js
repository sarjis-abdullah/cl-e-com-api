async function getMetaData(Model, query) {
  const { page = 1, limit = 10 } = query;
  const count = await Model.countDocuments();
  return {
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
}

module.exports = {
  getMetaData
}
