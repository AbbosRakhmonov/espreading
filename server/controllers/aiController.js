const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Setting = require("../models/Setting");
const AIConversation = require("../models/AIConversation");
const AIMessage = require("../models/AIMessage");
const { processStudentChat } = require("../services/aiChat");
const { getTaskDescription } = require("../utils/taskDescriptions");
const { getReadingMeta } = require("../utils/readingCatalog");

const ALLOWED_MODES = ["vocab", "hint", "explain_task"];
const READING_IDS = ["1", "2", "3", "4", "5", "6", "7"];
const HISTORY_LIMIT = 100;

exports.getAIStatus = asyncHandler(async (req, res, next) => {
  const doc = await Setting.findOne({ key: "ai_enabled" }).lean();
  const enabled = doc ? doc.value === true : true;
  res.status(200).json({ success: true, data: { enabled } });
});

exports.getAIChatHistory = asyncHandler(async (req, res, next) => {
  const readingId = req.query.readingId;
  const userId = req.user._id; // same user doc as protect middleware; ObjectId for consistent lookup

  if (!readingId || !READING_IDS.includes(String(readingId))) {
    return next(new ErrorResponse("Invalid or missing readingId", 400));
  }

  const conversation = await AIConversation.findOne({
    user: userId,
    readingId: String(readingId),
  }).lean();
  if (!conversation) {
    return res.status(200).json({ success: true, data: { messages: [] } });
  }

  const docs = await AIMessage.find({ conversationId: conversation._id })
    .sort({ createdAt: 1 })
    .limit(HISTORY_LIMIT)
    .select("role content createdAt")
    .lean();

  const messages = docs.map((m) => ({ role: m.role, content: m.content, createdAt: m.createdAt }));
  res.status(200).json({ success: true, data: { messages } });
});

exports.postAIChat = asyncHandler(async (req, res, next) => {
  const { readingId, mode, messages } = req.body;
  const userId = req.user._id.toString();

  if (!readingId || !READING_IDS.includes(String(readingId))) {
    return next(new ErrorResponse("Invalid or missing readingId", 400));
  }
  if (!mode || !ALLOWED_MODES.includes(mode)) {
    return next(new ErrorResponse("Invalid or missing mode", 400));
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return next(new ErrorResponse("messages array is required", 400));
  }
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || typeof last.content !== "string") {
    return next(new ErrorResponse("Last message must be from user with content", 400));
  }

  const taskDesc = getTaskDescription(readingId);
  const meta = getReadingMeta(readingId);
  if (!taskDesc || !meta) {
    return next(new ErrorResponse("Reading not found", 400));
  }

  const result = await processStudentChat({
    userId,
    readingId: String(readingId),
    mode,
    messages,
  });

  if (result.error) {
    if (result.error === "AI service not configured") {
      return res.status(503).json({ success: false, message: "AI help is temporarily unavailable." });
    }
    return res.status(503).json({ success: false, message: result.error });
  }

  if (result.blocked && result.refusalMessage) {
    return res.status(200).json({
      success: true,
      data: { message: { role: "assistant", content: result.refusalMessage } },
    });
  }

  if (result.message) {
    return res.status(200).json({ success: true, data: { message: result.message } });
  }

  return res.status(503).json({ success: false, message: "Unable to get a response." });
});
