// * Error handling middleware. Every api will call this if a "Catch" occurs at the end of the cycle
module.exports = (err, req, res, next) => {
  res.status(500).send({ status: false, message: err.stack || err.message });
};
