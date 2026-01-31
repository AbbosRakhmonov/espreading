const mongoose = require("mongoose");

const ReadingStrategySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["pre", "post"],
      required: true,
    },
    answers: {
      type: Map,
      of: Number,
      required: true,
    },
    // Calculated scores
    globScore: {
      type: Number,
      required: true,
    },
    globAverage: {
      type: Number,
      required: true,
    },
    probScore: {
      type: Number,
      required: true,
    },
    probAverage: {
      type: Number,
      required: true,
    },
    supScore: {
      type: Number,
      required: true,
    },
    supAverage: {
      type: Number,
      required: true,
    },
    overallAverage: {
      type: Number,
      required: true,
    },
    // Interpretation levels
    globLevel: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },
    probLevel: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },
    supLevel: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one pre and one post questionnaire per user
ReadingStrategySchema.index({ user: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("ReadingStrategy", ReadingStrategySchema);

