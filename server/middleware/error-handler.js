const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong",
  };

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    if (
      err.keyPattern.user_id === 1 ||
      err.keyPattern.organization_id === 1 ||
      err.keyPattern.workshop_id === 1
    ) {
      customError.message = "Već se nalazi u bazi";
    } else {
      customError.message = "Podatak već postoji";
    }
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.message = "Ne postoji";
    customError.statusCode = 404;
  }

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorHandlerMiddleware;
