const mongoose = require("mongoose");

const AIMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIConversation",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    feedback: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    tokens: {
      type: Number,
      default: null,
    },
    latencyMs: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

AIMessageSchema.index({ conversationId: 1, createdAt: 1 });
AIMessageSchema.index({ conversationId: 1 });

module.exports = mongoose.model("AIMessage", AIMessageSchema);
