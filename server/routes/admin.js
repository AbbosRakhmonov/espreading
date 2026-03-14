const express = require("express");
const router = express.Router();
const {
  getStatistics,
  getStudentStatistics,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  exportStudents,
  exportStatistics,
  getActivityLogs,
} = require("../controllers/admin");
const {
  getAISetting,
  updateAISetting,
  getAIStatistics,
  getStudentAIData,
  adminAskAboutStudent,
} = require("../controllers/aiAdmin");
const { protect } = require("../middleware/auth");
const { accessToRoute } = require("../middleware/auth");

// All admin routes require authentication and admin role
router.use(protect);
router.use(accessToRoute(["admin"]));

router.get("/statistics", getStatistics);
router.get("/statistics/export", exportStatistics);
router.get("/students", getStudentStatistics);
router.get("/students/export", exportStudents);
router.get("/students/:id", getStudentById);
router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);
router.get("/activity-logs", getActivityLogs);

router.get("/ai/setting", getAISetting);
router.put("/ai/setting", updateAISetting);
router.get("/ai/statistics", getAIStatistics);
router.get("/students/:id/ai", getStudentAIData);
router.post("/ai/ask-student", adminAskAboutStudent);

module.exports = router;
