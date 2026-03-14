const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Reading = require("../models/Reading");
const User = require("../models/User");
const { getReadingMeta } = require("../utils/readingCatalog");
const { getAnswerKeyForReading } = require("../utils/answerKeys");

// Mapping of reading ID to lesson and category
const readingToLessonCategory = {
  1: { lesson: 1, category: 1 },
  2: { lesson: 1, category: 3 },
  3: { lesson: 2, category: 1 },
  4: { lesson: 3, category: 1 },
  5: { lesson: 4, category: 1 },
  6: { lesson: 5, category: 1 },
  7: { lesson: 6, category: 1 },
};

const checkFirstReading = async (body, user) => {
  try {
    const { emma, carlos, fatima, liam, sofia, time } = body;
    if (![emma, carlos, fatima, liam, sofia, time].every(Boolean)) {
      throw new Error("All fields are required");
    }

    const correctAnswers = getAnswerKeyForReading(1);
    const score = Object.keys(correctAnswers).reduce((acc, key) => {
      return acc + (body[key] === correctAnswers[key] ? 1 : 0);
    }, 0);

    const { lesson, category } = readingToLessonCategory[1] || {};
    const meta = getReadingMeta(1);
    const reading = await Reading.create({
      user: user._id,
      reading: "1",
      lesson,
      category,
      lessonTitle: meta?.lessonTitle,
      categoryTitle: meta?.categoryTitle,
      readingTitle: meta?.readingTitle,
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
    answers = JSON.parse(answers);
    answers = Object.keys(answers).reduce((acc, key) => {
      acc[key] = Number(answers[key]);
      return acc;
    }, {});

    const correctAnswers = getAnswerKeyForReading(2);
    const score = Object.keys(correctAnswers).reduce((acc, key) => {
      return acc + (answers[key] === correctAnswers[key] ? 1 : 0);
    }, 0);

    const { lesson, category } = readingToLessonCategory[2] || {};
    const meta = getReadingMeta(2);
    const reading = await Reading.create({
      user: user._id,
      reading: "2",
      lesson,
      category,
      lessonTitle: meta?.lessonTitle,
      categoryTitle: meta?.categoryTitle,
      readingTitle: meta?.readingTitle,
      time,
      answers,
      score,
    });

    return reading;
  } catch (error) {
    throw error;
  }
};

const checkThirdReading = async (body, user) => {
  try {
    let { time, ...answers } = body;

    if (!time) {
      throw new Error("All fields are required");
    }
    const thirdReadingAnswers = getAnswerKeyForReading(3);
    const keys = Object.keys(thirdReadingAnswers);
    for (const key of keys) {
      if (!answers[key]) {
        throw new Error("All fields are required");
      }
    }
    time = Number(time);
    answers = Object.keys(answers).reduce((acc, key) => {
      if (answers[key] === "true" || answers[key] === "false") {
        acc[key] = Boolean(answers[key]);
      } else {
        acc[key] = answers[key];
      }
      return acc;
    }, {});

    const score = Object.keys(answers).reduce((acc, key) => {
      return acc + (answers[key] === thirdReadingAnswers[key] ? 1 : 0);
    }, 0);

    const { lesson, category } = readingToLessonCategory[3] || {};
    const meta = getReadingMeta(3);
    const reading = await Reading.create({
      user: user._id,
      reading: "3",
      lesson,
      category,
      lessonTitle: meta?.lessonTitle,
      categoryTitle: meta?.categoryTitle,
      readingTitle: meta?.readingTitle,
      time,
      answers,
      score,
    });

    return reading;
  } catch (error) {
    throw error;
  }
};

const checkFourthReading = async (body, user) => {
  try {
    let { time, ...answers } = body;

    if (!time) {
      throw new Error("All fields are required");
    }
    const fourthReadingAnswers = getAnswerKeyForReading(4);
    const keys = Object.keys(fourthReadingAnswers);

    for (const key of keys) {
      if (!answers[key]) {
        throw new Error("All fields are required");
      }
    }

    time = Number(time);

    const score = Object.keys(answers).reduce((acc, key) => {
      return acc + (answers[key] === fourthReadingAnswers[key] ? 1 : 0);
    }, 0);

    const { lesson, category } = readingToLessonCategory[4] || {};
    const meta = getReadingMeta(4);
    const reading = await Reading.create({
      user: user._id,
      reading: "4",
      lesson,
      category,
      lessonTitle: meta?.lessonTitle,
      categoryTitle: meta?.categoryTitle,
      readingTitle: meta?.readingTitle,
      time,
      answers,
      score,
    });

    return reading;
  } catch (error) {
    throw error;
  }
};

const checkFifthReading = async (body, user) => {
  try {
    let { time, ...answers } = body;

    if (!time) {
      throw new Error("All fields are required");
    }
    const fifthReadingAnswers = getAnswerKeyForReading(5);
    const keys = Object.keys(fifthReadingAnswers);

    for (const key of keys) {
      if (!answers[key]) {
        throw new Error("All fields are required");
      }
    }

    time = Number(time);

    const score = Object.keys(answers).reduce((acc, key) => {
      return acc + (answers[key] === fifthReadingAnswers[key] ? 1 : 0);
    }, 0);

    const { lesson, category } = readingToLessonCategory[5] || {};
    const meta = getReadingMeta(5);
    const reading = await Reading.create({
      user: user._id,
      reading: "5",
      lesson,
      category,
      lessonTitle: meta?.lessonTitle,
      categoryTitle: meta?.categoryTitle,
      readingTitle: meta?.readingTitle,
      time,
      answers,
      score,
    });

    return reading;
  } catch (error) {
    throw error;
  }
};

const checkSixthReading = async (body, user) => {
  try {
    let { time, ...answers } = body;

    if (!time) {
      throw new Error("All fields are required");
    }
    const sixthReadingAnswers = getAnswerKeyForReading(6);
    const keys = Object.keys(sixthReadingAnswers);

    for (const key of keys) {
      if (!answers[key]) {
        throw new Error("All fields are required");
      }
    }

    time = Number(time);

    const score = Object.keys(answers).reduce((acc, key) => {
      return acc + (answers[key] === sixthReadingAnswers[key] ? 1 : 0);
    }, 0);

    const { lesson, category } = readingToLessonCategory[6] || {};
    const meta = getReadingMeta(6);
    const reading = await Reading.create({
      user: user._id,
      reading: "6",
      lesson,
      category,
      lessonTitle: meta?.lessonTitle,
      categoryTitle: meta?.categoryTitle,
      readingTitle: meta?.readingTitle,
      time,
      answers,
      score,
    });

    return reading;
  } catch (error) {
    throw error;
  }
};

const checkSeventhReading = async (body, user) => {
  try {
    let { time, ...answers } = body;

    if (!time) {
      throw new Error("All fields are required");
    }
    const seventhReadingAnswers = getAnswerKeyForReading(7);
    const keys = Object.keys(seventhReadingAnswers);

    for (const key of keys) {
      if (!answers[key]) {
        throw new Error("All fields are required");
      }
    }

    time = Number(time);

    answers = Object.keys(answers).reduce((acc, key) => {
      if (answers[key] === "true" || answers[key] === "false") {
        acc[key] = answers[key];
      } else {
        acc[key] = answers[key];
      }
      return acc;
    }, {});

    const score = Object.keys(answers).reduce((acc, key) => {
      return acc + (answers[key] === seventhReadingAnswers[key] ? 1 : 0);
    }, 0);

    const { lesson, category } = readingToLessonCategory[7] || {};
    const meta = getReadingMeta(7);
    const reading = await Reading.create({
      user: user._id,
      reading: "7",
      lesson,
      category,
      lessonTitle: meta?.lessonTitle,
      categoryTitle: meta?.categoryTitle,
      readingTitle: meta?.readingTitle,
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

  // Check if reading already exists for this user
  const existingReading = await Reading.findOne({
    user: user._id,
    reading: id,
  }).lean();

  if (existingReading) {
    // Return existing reading (prevents duplicate submissions)
    return res.status(200).json(existingReading);
  }

  const checkReading = {
    1: checkFirstReading,
    2: checkSecondReading,
    3: checkThirdReading,
    4: checkFourthReading,
    5: checkFifthReading,
    6: checkSixthReading,
    7: checkSeventhReading,
  }[id];

  if (!checkReading) {
    return next(new ErrorResponse("Invalid reading id", 400));
  }

  try {
    const newReading = await checkReading(req.body, user);
    res.status(200).json(newReading);
  } catch (error) {
    // Handle duplicate key error (race condition - another request created it)
    if (error.code === 11000 || error.message?.includes("duplicate key") || error.message?.includes("E11000") || error.name === "MongoServerError") {
      // Fetch and return the existing reading
      const existingReading = await Reading.findOne({
        user: user._id,
        reading: id,
      }).lean();
      
      if (existingReading) {
        return res.status(200).json(existingReading);
      }
    }
    throw error;
  }
});

exports.checkReadingCompleted = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;
  if (!id) {
    return next(new ErrorResponse("Reading id is required", 400));
  }

  // Get the reading for this user
  const reading = await Reading.findOne({
    user: user._id,
    reading: req.params.id,
  }).lean();

  if (!reading) {
    return res.status(200).json({
      completed: false,
      score: 0,
    });
  }

  return res.status(200).json(reading);
});
