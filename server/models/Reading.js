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
  lesson: {
    type: Number,
    required: false,
  },
  lessonTitle: {
    type: String,
    required: false,
    trim: true,
  },
  category: {
    type: Number,
    required: false,
  },
  categoryTitle: {
    type: String,
    required: false,
    trim: true,
  },
  readingTitle: {
    type: String,
    required: false,
    trim: true,
  },
  time: {
    type: Number,
    default: 0,
  },
  answers: {},
  score: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// Unique constraint on user and reading to prevent duplicate submissions
ReadingSchema.index({ user: 1, reading: 1 }, { unique: true });

module.exports = mongoose.model("Reading", ReadingSchema);
