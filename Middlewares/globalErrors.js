const APIerrors = require("../Utils/Errors");

const handleInvalidSignature = () => {
  return new APIerrors("Invalid token, login again", 401);
};
const handleJwtExpired = () => {
  return new APIerrors("Expired token, login again", 401);
};

globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    if (err.name === "JsonWebTokenError") {
      err = handleInvalidSignature();
    }
    if (err.name === "TokenExpiredError") {
      err = handleJwtExpired();
    }
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

module.exports = globalError;
