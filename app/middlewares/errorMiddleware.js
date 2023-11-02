exports.notFound = (req, res, next) => {
  const error = new Error('Something went wrong!');
  error.status = 404;
  next(error);
};

exports.defaultError = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ error: message });
};
