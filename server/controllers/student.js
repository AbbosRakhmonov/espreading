const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Reading = require("../models/Reading");

const checkFirstReading = async (body, user) => {
  try {
    const { emma, carlos, fatima, liam, sofia, time } = body;
    if (![emma, carlos, fatima, liam, sofia, time].every(Boolean)) {
      return next(new ErrorResponse("All fields are required", 400));
    }

    const correctAnswers = {
      emma: "1",
      carlos: "2",
      fatima: "3",
      liam: "4",
      sofia: "5",
    };

    const score = Object.keys(correctAnswers).reduce((acc, key) => {
      return acc + (body[key] === correctAnswers[key] ? 1 : 0);
    }, 0);

    const reading = await Reading.create({
      user: user._id,
      reading: "1",
      time: Number(time),
      answers: body,
      score,
    });

    return reading;
  } catch (error) {
    throw error;
  }
};

const checkSecondReading = async (body) => {};

// Detail Comprehension
exports.submitReadingAnswers = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new ErrorResponse("Reading id is required", 400));
  }

  const user = req.user;

  const reading = await Reading.findOne({
    user: user._id,
    reading: req.params.id,
  });

  if (reading) {
    return next(
      new ErrorResponse("You have already completed this reading", 400)
    );
  }

  switch (id) {
    case "1":
      const R = await checkFirstReading(req.body, user);
      return res.status(200).json(R);
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
