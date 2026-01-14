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

module.exports = router;
