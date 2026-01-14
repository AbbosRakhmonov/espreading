const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "create_student",
        "update_student",
        "delete_student",
        "export_students",
        "export_statistics",
        "view_student",
        "view_statistics",
      ],
    },
    targetType: {
      type: String,
      enum: ["student", "statistics", "system"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    details: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
ActivityLogSchema.index({ admin: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
