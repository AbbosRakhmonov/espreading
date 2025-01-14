const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Reading = require("../models/Reading");

// Detail Comprehension
exports.LessonFirstReadingFirst = asyncHandler(async (req, res, next) => {});
// Sequencing
exports.LessonFirstReadingSecond = asyncHandler(async (req, res, next) => {});

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
    });
  }

  return res.status(200).json(reading);
});
w