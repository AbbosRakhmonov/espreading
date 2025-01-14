const express = require("express");
const router = express.Router();
const {
  checkReadingCompleted,
  submitReadingAnswers,
} = require("../controllers/student");
const { protect } = require("../middleware/auth");

router.get("/:id/completed", protect, checkReadingCompleted);
router.post("/:id", protect, submitReadingAnswers);

module.exports = router;
