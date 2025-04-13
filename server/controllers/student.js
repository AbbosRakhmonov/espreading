const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Reading = require("../models/Reading");

const thirdReadingAnswers = {
  "q1-1": false,
  "q1-2": true,
  "q1-3": true,
  "q1-4": false,
  "q1-5": false,
  "q2-1": "SPOTLIGHT HOG",
  "q2-2": "GOSSIP",
  "q2-3": "CALM",
  "q2-4": "BELLYACHER",
  "q2-5": "NEGATIVITY",
};

const fourthReadingAnswers = {
  "q1-1": "1",
  "q1-2": "2",
  "q1-3": "3",
  "q1-4": "4",
  "q1-5": "5",
  "q2-1": "false",
  "q2-2": "true",
  "q2-3": "false",
  "q2-4": "false",
  "q2-5": "true",
};

const fifthReadingAnswers = {
  "q1-1": "true",
  "q1-2": "false",
  "q1-3": "false",
  "q1-4": "true",
  "q1-5": "false",
  "q2-1": "1",
  "q2-2": "2",
  "q2-3": "3",
  "q2-4": "4",
  "q2-5": "5",
};

const sixthReadingAnswers = {
  "q1-1": "1",
  "q1-2": "2",
  "q1-3": "3",
  "q1-4": "4",
  "q1-5": "5",
  "q2-1": "false",
  "q2-2": "true",
  "q2-3": "false",
  "q2-4": "true",
  "q2-5": "false",
  "q3-1": "EMOTIONAL SYMPTOMS",
  "q3-2": "COGNITIVE-BEHAVIORAL THERAPY",
  "q3-3": "PARENTAL DIVORCE",
  "q3-4": "HEALTHY HABITS",
};

const seventhReadingAnswers = {
  "q1-1": "false",
  "q1-2": "true",
  "q1-3": "false",
  "q1-4": "true",
  "q1-5": "false",
  "q1-6": "true",
  "q1-7": "false",
  "q1-8": "true",
  "q1-9": "false",
  "q1-10": "true",
  "q2-1": "B",
  "q2-2": "A",
  "q2-3": "C",
  "q2-4": "D",
  "q2-5": "E",
};

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

const checkThirdReading = async (body, user) => {
  try {
    let { time, ...answers } = body;

    if (!time) {
      throw new Error("All fields are required");
    }
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

    const reading = await Reading.create({
      user: user._id,
      reading: "3",
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

    const reading = await Reading.create({
      user: user._id,
      reading: "4",
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

    const reading = await Reading.create({
      user: user._id,
      reading: "5",
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

    const reading = await Reading.create({
      user: user._id,
      reading: "6",
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

    const reading = await Reading.create({
      user: user._id,
      reading: "7",
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
    3: checkThirdReading,
    4: checkFourthReading,
    5: checkFifthReading,
    6: checkSixthReading,
    7: checkSeventhReading,
  }[id];

  if (!checkReading) {
    return next(new ErrorResponse("Invalid reading id", 400));
  }

  const newReading = await checkReading(req.body, user);
  res.status(200).json(newReading);
});

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
