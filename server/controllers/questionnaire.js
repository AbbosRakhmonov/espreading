const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const ReadingStrategy = require("../models/ReadingStrategy");
const Reading = require("../models/Reading");
const User = require("../models/User");

// Question mappings from PDF
const GLOB_QUESTIONS = [1, 3, 4, 6, 8, 12, 15, 17, 20, 21, 23, 24, 27]; // 13 questions
const PROB_QUESTIONS = [7, 9, 11, 14, 16, 19, 25, 28]; // 8 questions
const SUP_QUESTIONS = [2, 5, 10, 13, 18, 22, 26, 29, 30]; // 9 questions

// Calculate scores and averages
const calculateScores = (answers) => {
  // Handle both Map and object
  const getAnswer = (q) => {
    if (answers instanceof Map) {
      return answers.get(q.toString()) || 0;
    }
    return answers[q.toString()] || 0;
  };

  const globAnswers = GLOB_QUESTIONS.map((q) => getAnswer(q));
  const probAnswers = PROB_QUESTIONS.map((q) => getAnswer(q));
  const supAnswers = SUP_QUESTIONS.map((q) => getAnswer(q));

  const globScore = globAnswers.reduce((sum, val) => sum + val, 0);
  const probScore = probAnswers.reduce((sum, val) => sum + val, 0);
  const supScore = supAnswers.reduce((sum, val) => sum + val, 0);

  const globAverage = globScore / GLOB_QUESTIONS.length;
  const probAverage = probScore / PROB_QUESTIONS.length;
  const supAverage = supScore / SUP_QUESTIONS.length;
  const overallAverage = (globScore + probScore + supScore) / 30;

  // Determine levels
  const getLevel = (avg) => {
    if (avg >= 3.5) return "High";
    if (avg >= 2.5) return "Medium";
    return "Low";
  };

  return {
    globScore,
    globAverage,
    probScore,
    probAverage,
    supScore,
    supAverage,
    overallAverage,
    globLevel: getLevel(globAverage),
    probLevel: getLevel(probAverage),
    supLevel: getLevel(supAverage),
  };
};

// Check if student can take pre-questionnaire (before lesson 1)
const canTakePreQuestionnaire = async (userId) => {
  const hasLesson1Readings = await Reading.exists({
    user: userId,
    lesson: 1,
  });
  return !hasLesson1Readings;
};

// Check if student can take post-questionnaire (after last lesson with content)
const canTakePostQuestionnaire = async (userId) => {
  // Find the highest lesson number that has readings in the database (from any user)
  // This dynamically finds the last lesson with content in the system
  const lastLessonWithReadings = await Reading.findOne(
    { 
      completed: true,
      lesson: { $exists: true, $ne: null } // Ensure lesson field exists and is not null
    },
    { lesson: 1 }
  )
    .sort({ lesson: -1 })
    .lean();
  
  if (!lastLessonWithReadings || !lastLessonWithReadings.lesson) {
    return false; // No lessons with content exist yet
  }
  
  const lastLesson = lastLessonWithReadings.lesson;
  
  // Check if THIS student has completed the last lesson with content
  const hasLastLessonReadings = await Reading.exists({
    user: userId,
    lesson: lastLesson,
    completed: true,
  });
  
  return hasLastLessonReadings;
};

// Submit questionnaire
exports.submitQuestionnaire = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { type, answers } = req.body;

  if (!type || !answers) {
    return next(new ErrorResponse("Type and answers are required", 400));
  }

  if (!["pre", "post"].includes(type)) {
    return next(new ErrorResponse("Type must be 'pre' or 'post'", 400));
  }

  // Check if already submitted (with race condition protection)
  let existing = await ReadingStrategy.findOne({
    user: user._id,
    type,
  });

  // For pre-questionnaire: if student has no reading history, allow retaking
  if (existing && type === "pre") {
    const hasAnyReadings = await Reading.exists({
      user: user._id,
    });
    // If no readings exist, delete the old submission and allow new one
    if (!hasAnyReadings) {
      await ReadingStrategy.deleteOne({
        user: user._id,
        type: "pre",
      });
      existing = null; // Allow new submission
    }
  }

  if (existing) {
    // If already exists, return the existing record (idempotent behavior)
    const questionnaireObj = existing.toObject();
    questionnaireObj.answers = Object.fromEntries(existing.answers);
    return res.status(200).json({
      success: true,
      data: questionnaireObj,
      message: `Questionnaire already submitted`,
    });
  }

  // Validate answers - must have all 30 questions
  if (Object.keys(answers).length !== 30) {
    return next(
      new ErrorResponse("All 30 questions must be answered", 400)
    );
  }

  // Validate answer values (1-5)
  for (let i = 1; i <= 30; i++) {
    const answer = answers[i.toString()];
    if (!answer || answer < 1 || answer > 5) {
      return next(
        new ErrorResponse(
          `Question ${i} must have a value between 1 and 5`,
          400
        )
      );
    }
  }

  // Check eligibility
  // No validation for lesson completion - allow submission if not already submitted
  // This allows students who have already completed lessons to submit questionnaires
  // The one-time submission rule (unique index) still applies to prevent duplicates

  // Convert answers to Map
  const answersMap = new Map();
  for (let i = 1; i <= 30; i++) {
    answersMap.set(i.toString(), parseInt(answers[i.toString()]));
  }

  // Calculate scores
  const scores = calculateScores(answersMap);

  // Create questionnaire response
  // Use try-catch to handle race condition (if two requests come simultaneously)
  try {
    const questionnaire = await ReadingStrategy.create({
      user: user._id,
      type,
      answers: answersMap,
      ...scores,
    });

    // Convert Map to object for JSON serialization
    const questionnaireObj = questionnaire.toObject();
    questionnaireObj.answers = Object.fromEntries(questionnaire.answers);

    res.status(201).json({
      success: true,
      data: questionnaireObj,
    });
  } catch (error) {
    // Handle duplicate key error (race condition - another request created it)
    if (error.code === 11000 || error.message?.includes("duplicate key") || error.message?.includes("E11000") || error.name === "MongoServerError") {
      // Fetch and return the existing questionnaire
      existing = await ReadingStrategy.findOne({
        user: user._id,
        type,
      }).lean();

      if (existing) {
        // Convert Map to object for JSON serialization
        const questionnaireObj = { ...existing };
        questionnaireObj.answers = existing.answers instanceof Map 
          ? Object.fromEntries(existing.answers) 
          : existing.answers;

        return res.status(200).json({
          success: true,
          data: questionnaireObj,
          message: `Questionnaire already submitted`,
        });
      }
    }
    // Re-throw if it's not a duplicate key error
    throw error;
  }
});

// Get questionnaire status for current user
exports.getQuestionnaireStatus = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const preQuestionnaire = await ReadingStrategy.findOne({
    user: user._id,
    type: "pre",
  }).lean();

  const postQuestionnaire = await ReadingStrategy.findOne({
    user: user._id,
    type: "post",
  }).lean();

  const canTakePre = await canTakePreQuestionnaire(user._id);
  const canTakePost = await canTakePostQuestionnaire(user._id);

  // If pre-questionnaire hasn't been submitted, always allow it (regardless of reading status)
  // This ensures students can always take the pre-questionnaire if they haven't submitted it
  // Only check reading status if they've already submitted (to prevent retaking after starting lessons)
  // IMPORTANT: If preQuestionnaire is null/undefined (not submitted), always return true
  const canTakePreFinal = preQuestionnaire === null || preQuestionnaire === undefined ? true : canTakePre;
  
  // Debug logging
  console.log("Questionnaire Status Check:", {
    userId: user._id.toString(),
    preQuestionnaire: preQuestionnaire,
    preQuestionnaireExists: !!preQuestionnaire,
    preQuestionnaireIsNull: preQuestionnaire === null,
    preQuestionnaireIsUndefined: preQuestionnaire === undefined,
    canTakePre,
    canTakePreFinal,
    canTakePost
  });

  res.status(200).json({
    success: true,
    data: {
      pre: {
        submitted: !!preQuestionnaire,
        canTake: canTakePreFinal,
        data: preQuestionnaire || null,
      },
      post: {
        submitted: !!postQuestionnaire,
        canTake: canTakePost,
        data: postQuestionnaire || null,
      },
    },
  });
});

// Get all questionnaire responses (admin only)
exports.getAllQuestionnaires = asyncHandler(async (req, res, next) => {
  const questionnaires = await ReadingStrategy.find()
    .populate("user", "fullName email university")
    .sort({ createdAt: -1 })
    .lean();

  // Convert Map to object for JSON serialization
  const questionnairesWithAnswers = questionnaires.map((q) => ({
    ...q,
    answers: q.answers instanceof Map ? Object.fromEntries(q.answers) : q.answers,
  }));

  res.status(200).json({
    success: true,
    data: questionnairesWithAnswers,
  });
});

// Get questionnaire statistics (admin only)
exports.getQuestionnaireStatistics = asyncHandler(async (req, res, next) => {
  const { type } = req.query; // 'pre' or 'post' or undefined for both

  const matchQuery = type ? { type } : {};

  // Get all questionnaires
  const questionnaires = await ReadingStrategy.find(matchQuery)
    .populate("user", "fullName email university")
    .lean();

  if (questionnaires.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        overall: {
          globAverage: 0,
          probAverage: 0,
          supAverage: 0,
          globLevel: "Low",
          probLevel: "Low",
          supLevel: "Low",
        },
        byInstitution: [],
      },
    });
  }

  // Calculate overall averages
  const totalGlob = questionnaires.reduce(
    (sum, q) => sum + q.globAverage,
    0
  );
  const totalProb = questionnaires.reduce(
    (sum, q) => sum + q.probAverage,
    0
  );
  const totalSup = questionnaires.reduce(
    (sum, q) => sum + q.supAverage,
    0
  );
  const count = questionnaires.length;

  const overallGlobAverage = totalGlob / count;
  const overallProbAverage = totalProb / count;
  const overallSupAverage = totalSup / count;

  const getLevel = (avg) => {
    if (avg >= 3.5) return "High";
    if (avg >= 2.5) return "Medium";
    return "Low";
  };

  // Group by institution
  const byInstitution = {};
  questionnaires.forEach((q) => {
    const university = q.user?.university || "Unknown";
    if (!byInstitution[university]) {
      byInstitution[university] = {
        university,
        questionnaires: [],
        globTotal: 0,
        probTotal: 0,
        supTotal: 0,
      };
    }
    byInstitution[university].questionnaires.push(q);
    byInstitution[university].globTotal += q.globAverage;
    byInstitution[university].probTotal += q.probAverage;
    byInstitution[university].supTotal += q.supAverage;
  });

  // Calculate averages per institution
  const institutionStats = Object.values(byInstitution).map((inst) => {
    const count = inst.questionnaires.length;
    return {
      university: inst.university,
      count,
      globAverage: inst.globTotal / count,
      probAverage: inst.probTotal / count,
      supAverage: inst.supTotal / count,
      globLevel: getLevel(inst.globTotal / count),
      probLevel: getLevel(inst.probTotal / count),
      supLevel: getLevel(inst.supTotal / count),
    };
  });

  res.status(200).json({
    success: true,
    data: {
      overall: {
        globAverage: overallGlobAverage,
        probAverage: overallProbAverage,
        supAverage: overallSupAverage,
        globLevel: getLevel(overallGlobAverage),
        probLevel: getLevel(overallProbAverage),
        supLevel: getLevel(overallSupAverage),
      },
      byInstitution: institutionStats,
    },
  });
});

// Get individual student questionnaire (admin only)
exports.getStudentQuestionnaire = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;

  const questionnaires = await ReadingStrategy.find({
    user: studentId,
  })
    .populate("user", "fullName email university")
    .lean();

  // Convert Map to object for JSON serialization
  const questionnairesWithAnswers = questionnaires.map((q) => ({
    ...q,
    answers: q.answers instanceof Map ? Object.fromEntries(q.answers) : q.answers,
  }));

  res.status(200).json({
    success: true,
    data: questionnairesWithAnswers,
  });
});

