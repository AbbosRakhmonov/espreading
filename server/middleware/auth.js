const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, _, next) => {
  const token = req.cookies.espreading;
  console.log(token);

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 500));
  }

  try {
    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("User not found", 500));
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(new ErrorResponse("Token expired", 500));
  }
});

exports.accessToRoute = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
