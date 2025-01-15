const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Handle Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = new ErrorResponse("Resource not found", 404);
  }

  // Handle Mongoose duplicate key
  if (err.code === 11000) {
    const keys = Object.keys(err.keyPattern).join(", ");
    error = new ErrorResponse(`The ${keys} field must be unique`, 400);
  }

  // Handle Mongoose validation error
  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors || {})
      .map(({ message }) => message)
      .join(", ");
    error = new ErrorResponse(error.message, 400);
  }

  if (error === undefined) {
    error = new ErrorResponse("An unknown error occurred", 500);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
  });
};

module.exports = errorHandler;
