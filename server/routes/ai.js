const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { getAIStatus, getAIChatHistory, postAIChat } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  keyGenerator: (req) => (req.user && req.user._id ? req.user._id.toString() : req.ip),
});

router.get("/status", getAIStatus);
router.get("/history", protect, getAIChatHistory);
router.post("/chat", protect, chatLimiter, postAIChat);

module.exports = router;
