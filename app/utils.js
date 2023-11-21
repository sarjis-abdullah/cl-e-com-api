const nodemailer = require('nodemailer');
const dotenv     = require("dotenv");
dotenv.config();

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

function sortAndPagination(query) {
  const { page, limit } = getPageLimit(query);
  const sortBy = query?.sortBy == "updatedAt" ? "updatedAt" : "createdAt";
  const sortDirection = query?.sortDirection === "desc" ? -1 : 1;
  const sorting = { $sort: { [sortBy]: sortDirection } }

  const container = {
    $facet: {
      items: [
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ],
      totalCount: [
        { $count: 'total' },
      ],
    },
  }
  return {
    sorting,
    container
  }
}
function getMetaInfo(result, query) {
  const { page, limit } = getPageLimit(query);
  const total = result.totalCount[0] ? result.totalCount[0].total : 0;
  return {
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  }
}

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

module.exports = {
  getMetaData,
  sortAndPaginate,
  needToInclude,
  sortAndPagination,
  getMetaInfo,
  useNodeMailer: transport
}
