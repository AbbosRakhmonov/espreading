const express = require("express");
const router = express.Router();
const {
  checkReadingCompleted,
  submitReadingAnswers,
} = require("../controllers/student");
const { protect } = require("../middleware/auth");

router
  .route("/:id/completed")
  .get(protect, checkReadingCompleted)
  .post(protect, submitReadingAnswers);

module.exports = router;
