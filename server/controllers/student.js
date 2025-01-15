const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Reading = require("../models/Reading");

const checkFirstReading = async (body, user) => {
  try {
    const { emma, carlos, fatima, liam, sofia, time } = body;
    if (![emma, carlos, fatima, liam, sofia, time].every(Boolean)) {
      throw new Error("All fields are required");
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

const checkSecondReading = async (body, user) => {
  try {
    let { time, answers } = body;
    if (!time || !answers) {
      throw new Error("All fields are required");
    }
    time = Number(time);
    // answers is object like correct answers
    answers = JSON.parse(answers);
    answers = Object.keys(answers).reduce((acc, key) => {
      acc[key] = Number(answers[key]);
      return acc;
    }, {});

    const correctAnswers = {
      0: 2,
      1: 3,
      2: 5,
      3: 6,
      4: 7,
      5: 1,
      6: 4,
    };

    const score = Object.keys(correctAnswers).reduce((acc, key) => {
      return acc + (answers[key] === correctAnswers[key] ? 1 : 0);
    }, 0);

    const reading = await Reading.create({
      user: user._id,
      reading: "2",
      time,
      answers,
      score,
    });

    return reading;
  } catch (error) {
    throw error;
  }
};

exports.submitReadingAnswers = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  if (!id) {
    return next(new ErrorResponse("Reading id is required", 400));
  }

  const reading = await Reading.findOne({ user: user._id, reading: id });

  if (reading) {
    return next(
      new ErrorResponse("You have already completed this reading", 400)
    );
  }

  const checkReading = {
    1: checkFirstReading,
    2: checkSecondReading,
  }[id];

  if (!checkReading) {
    return next(new ErrorResponse("Invalid reading id", 400));
  }

  const newReading = await checkReading(req.body, user);
  res.status(200).json(newReading);
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
