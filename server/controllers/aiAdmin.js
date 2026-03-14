const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Setting = require("../models/Setting");
const User = require("../models/User");
const AIConversation = require("../models/AIConversation");
const AIMessage = require("../models/AIMessage");
const ActivityLog = require("../models/ActivityLog");
const { getReadingMeta } = require("../utils/readingCatalog");
const { adminAskAboutStudent } = require("../services/adminAskStudent");

const logActivity = async (adminId, action, targetType, targetId, details, metadata) => {
  try {
    await ActivityLog.create({
      admin: adminId,
      action,
      targetType,
      targetId,
      details,
      metadata,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

exports.getAISetting = asyncHandler(async (req, res, next) => {
  const doc = await Setting.findOne({ key: "ai_enabled" }).lean();
  const enabled = doc ? doc.value === true : true;
  res.status(200).json({ success: true, data: { enabled } });
});

exports.updateAISetting = asyncHandler(async (req, res, next) => {
  const { enabled } = req.body;
  if (typeof enabled !== "boolean") {
    return next(new ErrorResponse("enabled must be a boolean", 400));
  }
  await Setting.findOneAndUpdate(
    { key: "ai_enabled" },
    { $set: { value: enabled } },
    { upsert: true, new: true }
  );
  await logActivity(
    req.user._id,
    "ai_toggle",
    "system",
    null,
    `AI help ${enabled ? "enabled" : "disabled"}`,
    {}
  );
  res.status(200).json({ success: true, data: { enabled } });
});

exports.getAIStatistics = asyncHandler(async (req, res, next) => {
  const conversations = await AIConversation.find().lean();
  const conversationIds = conversations.map((c) => c._id);
  const messageCounts = await AIMessage.aggregate([
    { $match: { conversationId: { $in: conversationIds } } },
    { $group: { _id: "$conversationId", count: { $sum: 1 } } },
  ]);
  const countByConv = {};
  messageCounts.forEach((m) => { countByConv[m._id.toString()] = m.count; });

  const totalMessages = messageCounts.reduce((s, m) => s + m.count, 0);
  const uniqueUsers = new Set(conversations.map((c) => c.user.toString())).size;
  const byMode = {};
  const byRouting = { normal: 0, escalated: 0 };
  const byReading = {};
  conversations.forEach((c) => {
    byMode[c.mode] = (byMode[c.mode] || 0) + 1;
    byRouting[c.routing || "normal"] = (byRouting[c.routing || "normal"] || 0) + 1;
    const r = c.readingId;
    byReading[r] = (byReading[r] || 0) + 1;
  });

  const topStudents = await AIConversation.aggregate([
    { $group: { _id: "$user", totalMessages: { $sum: 1 } } },
    { $sort: { totalMessages: -1 } },
    { $limit: 20 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDoc",
      },
    },
    { $unwind: "$userDoc" },
    {
      $project: {
        studentId: "$_id",
        fullName: "$userDoc.fullName",
        email: "$userDoc.email",
        conversationCount: "$totalMessages",
      },
    },
  ]);

  const msgTotalsByUser = await AIMessage.aggregate([
    { $lookup: { from: "aiconversations", localField: "conversationId", foreignField: "_id", as: "conv" } },
    { $unwind: "$conv" },
    { $group: { _id: "$conv.user", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalConversations: conversations.length,
        totalMessages,
        activeStudents: uniqueUsers,
      },
      byMode,
      byRouting,
      byReading: Object.entries(byReading).map(([readingId, count]) => ({
        readingId,
        readingTitle: getReadingMeta(readingId)?.readingTitle || `Reading ${readingId}`,
        count,
      })),
      topStudents: topStudents.map((s) => ({
        studentId: s.studentId,
        fullName: s.fullName,
        email: s.email,
        conversationCount: s.conversationCount,
      })),
    },
  });
});

exports.getStudentAIData = asyncHandler(async (req, res, next) => {
  const { id: studentId } = req.params;
  if (!studentId) return next(new ErrorResponse("Student ID required", 400));

  const student = await User.findById(studentId).select("fullName email role").lean();
  if (!student) return next(new ErrorResponse("Student not found", 404));
  if (student.role !== "student") return next(new ErrorResponse("User is not a student", 400));

  const conversations = await AIConversation.find({ user: studentId }).sort({ lastMessageAt: -1 }).lean();
  const result = [];
  for (const conv of conversations) {
    const messages = await AIMessage.find({ conversationId: conv._id }).sort({ createdAt: 1 }).lean();
    const meta = getReadingMeta(conv.readingId);
    result.push({
      conversationId: conv._id,
      readingId: conv.readingId,
      readingTitle: meta?.readingTitle || `Reading ${conv.readingId}`,
      mode: conv.mode,
      routing: conv.routing,
      flags: conv.flags,
      messageCount: messages.length,
      lastMessageAt: conv.lastMessageAt,
      messages: messages.map((m) => ({ role: m.role, content: m.content, createdAt: m.createdAt })),
    });
  }

  res.status(200).json({ success: true, data: { student: { _id: studentId, fullName: student.fullName, email: student.email }, conversations: result } });
});

exports.adminAskAboutStudent = asyncHandler(async (req, res, next) => {
  const { studentId, messages } = req.body;
  if (!studentId) return next(new ErrorResponse("studentId required", 400));
  if (!Array.isArray(messages) || messages.length === 0) {
    return next(new ErrorResponse("messages array required", 400));
  }

  const out = await adminAskAboutStudent(studentId, messages);
  if (out.error) {
    if (out.error === "Student not found") return next(new ErrorResponse(out.error, 404));
    if (out.error.includes("disabled") || out.error.includes("not configured")) {
      return res.status(503).json({ success: false, message: out.error });
    }
    return res.status(500).json({ success: false, message: out.error });
  }
  res.status(200).json({ success: true, data: { message: out.message } });
});
