const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

/**
 * Sends a response with a specified user object and sets a cookie with the token.
 *
 * @param {Object} res - The response object.
 * @param {string} token - The JWT token to be set as a cookie.
 * @param {Object} user - The user object to be sent in the response.
 */

const sendWithCookie = (res, token, user) => {
  return res
    .status(200)
    .cookie("espreading", token, {
      // 15 days
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    })
    .json(user);
};

exports.register = asyncHandler(async (req, res, next) => {
  const { secretKey } = req.body;

  let body = req.body;

  if (secretKey) {
    if (secretKey !== process.env.SECRET_KEY) {
      return next(new ErrorResponse("Secret key is wrong", 400));
    }

    body = {
      fullName: "Admin",
      email: "admin@espreading.uz",
      passwrod: "123456#",
      role: "admin",
      university: "ESP Reading",
    };
  }

  const user = await User.create(body);
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  let token = user.getSignedJwtToken();

  // send token in cookie and user as json
  return sendWithCookie(res, token, userWithoutPassword);
});

exports.login = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

  // Validate login & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const user = await User.findOne({
    email: { $regex: new RegExp(email, "i") },
  }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse("Email or password is incorrect", 500));
  }

  let token = user.getSignedJwtToken();

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return sendWithCookie(res, token, userWithoutPassword);
});

exports.logout = asyncHandler(async (req, res, next) => {
  // clear cookie and expire token
  return res.clearCookie("espreading").status(200).json({
    success: true,
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  return res.status(200).json(user);
});
