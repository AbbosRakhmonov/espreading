const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Reading = require("../models/Reading");

// Detail Comprehension
exports.submitReadingAnswers = asyncHandler(async (req, res, next) => {
  const { answers } = req.body;
  const id = req.params.id;
  if (!id) {
    return next(new ErrorResponse("Reading id is required", 400));
  }

  switch (id) {
    case "1":
      return res.status(200).json({
        completed: true,
      });
    default:
      return next(new ErrorResponse("Invalid reading id", 400));
  }
});

// check reading completed
exports.checkReadingCompleted = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;
  if (!id) {
    return next(new ErrorResponse("Reading id is required", 400));
  }

  const reading = await Reading.findOne({
    user: user._id,
    reading: req.params.id,
  });

  if (!reading) {
    return res.status(200).json({
      completed: false,
      score: 0,
    });
  }

  return res.status(200).json(reading);
});
