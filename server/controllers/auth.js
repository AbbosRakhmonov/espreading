const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const sendWithCookie = (res, token, user) => {
  const isProduction = process.env.NODE_ENV === "production";
  res
    .status(200)
    .cookie("espreading", token, {
      httpOnly: true, // Always httpOnly for security
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      secure: isProduction, // true in production (HTTPS), false in development (HTTP)
      sameSite: isProduction ? "none" : "lax", // "none" requires secure: true, so use "lax" in development
      path: "/",
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
      password: "123456##",
      role: "admin",
      university: "ESP Reading",
    };
  }

  const checkAlreadyExists = await User.findOne({ email: body.email });

  if (checkAlreadyExists) {
    return next(new ErrorResponse("User with this email already exists", 400));
  }

  const user = await User.create(body);
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  let token = user.getSignedJwtToken();

  return sendWithCookie(res, token, userWithoutPassword);
});

exports.login = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

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
  const isProduction = process.env.NODE_ENV === "production";
  // Clear cookie by setting it to empty with immediate expiration
  // Options must match exactly how the cookie was set
  res
    .cookie("espreading", "", {
      httpOnly: true,
      maxAge: 0, // Set to 0 to expire immediately
      expires: new Date(0), // Set to past date to expire immediately
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    })
    .status(200)
    .json({
      success: true,
    });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  return res.status(200).json(user);
});
