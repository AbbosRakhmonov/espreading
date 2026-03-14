const mongoose = require("mongoose");

const AIConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readingId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    mode: {
      type: String,
      enum: ["vocab", "hint", "explain_task"],
      default: "vocab",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    summarySoFar: {
      type: String,
      default: null,
    },
    flags: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    routing: {
      type: String,
      enum: ["normal", "escalated"],
      default: "normal",
    },
    analyticsTags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

AIConversationSchema.index({ user: 1, readingId: 1 });
AIConversationSchema.index({ user: 1 });
AIConversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model("AIConversation", AIConversationSchema);
