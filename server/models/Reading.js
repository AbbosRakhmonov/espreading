const mongoose = require("mongoose");

const ReadingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reading: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    default: 0,
  },
  answers: [],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

ReadingCompletionSchema.index({ user: 1, reading: 1 }, { unique: true });

module.exports = mongoose.model("Reading", ReadingSchema);
