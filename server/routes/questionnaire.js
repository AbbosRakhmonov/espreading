const express = require("express");
const router = express.Router();
const {
  submitQuestionnaire,
  getQuestionnaireStatus,
  getAllQuestionnaires,
  getQuestionnaireStatistics,
  getStudentQuestionnaire,
} = require("../controllers/questionnaire");
const { protect } = require("../middleware/auth");
const { accessToRoute } = require("../middleware/auth");

// Student routes (require authentication)
router.get("/status", protect, getQuestionnaireStatus);
router.post("/submit", protect, submitQuestionnaire);

// Admin routes (require authentication and admin role)
router.get("/all", protect, accessToRoute(["admin"]), getAllQuestionnaires);
router.get("/statistics", protect, accessToRoute(["admin"]), getQuestionnaireStatistics);
router.get("/student/:studentId", protect, accessToRoute(["admin"]), getStudentQuestionnaire);

module.exports = router;

