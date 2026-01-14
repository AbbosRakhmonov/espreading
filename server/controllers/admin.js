const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Reading = require("../models/Reading");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const { getReadingMeta } = require("../utils/readingCatalog");

// Helper function to log admin activities
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
  } catch (error) {
    // Don't throw error if logging fails - it's not critical
    console.error("Failed to log activity:", error);
  }
};

// Mapping of reading ID to lesson and category
const readingToLessonCategory = {
  1: { lesson: 1, category: 1 },
  2: { lesson: 1, category: 3 },
  3: { lesson: 2, category: 1 },
  4: { lesson: 3, category: 1 },
  5: { lesson: 4, category: 1 },
  6: { lesson: 5, category: 1 },
  7: { lesson: 6, category: 1 },
};

async function backfillReadingTitlesIfNeeded() {
  const toUpdate = await Reading.find({
    $or: [
      { lessonTitle: { $exists: false } },
      { lessonTitle: null },
      { categoryTitle: { $exists: false } },
      { categoryTitle: null },
      { readingTitle: { $exists: false } },
      { readingTitle: null },
      { lesson: { $exists: false } },
      { lesson: null },
      { category: { $exists: false } },
      { category: null },
    ],
  })
    .select("_id reading lesson category lessonTitle categoryTitle readingTitle")
    .lean();

  for (const r of toUpdate) {
    const meta = getReadingMeta(r.reading);
    if (!meta) continue;
    await Reading.updateOne(
      { _id: r._id },
      {
        $set: {
          lesson: r.lesson ?? meta.lessonId,
          category: r.category ?? meta.categoryId,
          lessonTitle: r.lessonTitle ?? meta.lessonTitle,
          categoryTitle: r.categoryTitle ?? meta.categoryTitle,
          readingTitle: r.readingTitle ?? meta.readingTitle,
        },
      }
    );
  }
}

// Get overall statistics
exports.getStatistics = asyncHandler(async (req, res, next) => {
  // Ensure legacy documents have titles/lesson/category for accurate UI
  await backfillReadingTitlesIfNeeded();

  // Get total students (excluding admins)
  const totalStudents = await User.countDocuments({ role: "student" });

  // Get total readings completed (students only)
  const totalReadingsAgg = await Reading.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    { $match: { "userInfo.role": "student", completed: true } },
    { $count: "count" },
  ]);
  const totalReadings = totalReadingsAgg[0]?.count || 0;

  // Get students by university
  const studentsByUniversity = await User.aggregate([
    { $match: { role: "student" } },
    {
      $group: {
        _id: "$university",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Calculate university percentages
  const universityStats = studentsByUniversity.map((uni) => ({
    university: uni._id,
    count: uni.count,
    percentage: totalStudents > 0 ? ((uni.count / totalStudents) * 100).toFixed(2) : 0,
  }));

  // Get score distribution by university
  const scoreDistribution = await Reading.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    { $match: { "userInfo.role": "student", completed: true } },
    {
      $group: {
        _id: {
          university: "$userInfo.university",
          score: "$score",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Get average score by university
  const avgScoreByUniversity = await Reading.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    { $match: { "userInfo.role": "student", completed: true } },
    {
      $group: {
        _id: "$userInfo.university",
        avgScore: { $avg: "$score" },
        totalReadings: { $sum: 1 },
      },
    },
  ]);

  // Get readings by lesson and category
  // First, update readings without lesson/category using the mapping
  const readingsToUpdate = await Reading.find({
    $or: [{ lesson: { $exists: false } }, { lesson: null }, { category: { $exists: false } }, { category: null }],
  }).lean();

  for (const reading of readingsToUpdate) {
    const mapping = readingToLessonCategory[parseInt(reading.reading)];
    if (mapping) {
      await Reading.updateOne(
        { _id: reading._id },
        { $set: { lesson: mapping.lesson, category: mapping.category } }
      );
    }
  }

  const readingsByLesson = await Reading.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    { $match: { "userInfo.role": "student" } },
    {
      $group: {
        _id: {
          lesson: { $ifNull: ["$lesson", 0] },
          category: { $ifNull: ["$category", 0] },
          reading: "$reading",
          lessonTitle: { $ifNull: ["$lessonTitle", ""] },
          categoryTitle: { $ifNull: ["$categoryTitle", ""] },
          readingTitle: { $ifNull: ["$readingTitle", ""] },
        },
        completed: {
          $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] },
        },
        avgScore: { $avg: { $cond: [{ $eq: ["$completed", true] }, "$score", null] } },
        avgTime: { $avg: { $cond: [{ $eq: ["$completed", true] }, "$time", null] } },
      },
    },
    { $sort: { "_id.lesson": 1, "_id.category": 1, "_id.reading": 1 } },
  ]);

  // Get student progress details
  const studentProgress = await Reading.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    { $match: { "userInfo.role": "student" } },
    {
      $project: {
        studentName: "$userInfo.fullName",
        studentEmail: "$userInfo.email",
        university: "$userInfo.university",
        reading: "$reading",
        lesson: "$lesson",
        category: "$category",
        lessonTitle: "$lessonTitle",
        categoryTitle: "$categoryTitle",
        readingTitle: "$readingTitle",
        score: "$score",
        time: "$time",
        completed: "$completed",
        completedAt: "$completedAt",
      },
    },
    { $sort: { university: 1, studentName: 1, lesson: 1 } },
  ]);

  // Get completion rate by reading
  const completionRate = await Reading.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    { $match: { "userInfo.role": "student" } },
    {
      $group: {
        _id: "$reading",
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
        },
        avgScore: { $avg: { $cond: [{ $eq: ["$completed", true] }, "$score", null] } },
        avgTime: { $avg: { $cond: [{ $eq: ["$completed", true] }, "$time", null] } },
        readingTitle: { $first: "$readingTitle" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Get recent completions (students only)
  const recentCompletions = await Reading.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    { $match: { "userInfo.role": "student", completed: true } },
    { $sort: { completedAt: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 1,
        reading: 1,
        lesson: 1,
        category: 1,
        lessonTitle: 1,
        categoryTitle: 1,
        readingTitle: 1,
        score: 1,
        time: 1,
        completed: 1,
        completedAt: 1,
        user: {
          _id: "$userInfo._id",
          fullName: "$userInfo.fullName",
          email: "$userInfo.email",
          university: "$userInfo.university",
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalStudents,
        totalReadings,
      },
      universityStats,
      scoreDistribution,
      avgScoreByUniversity,
      readingsByLesson,
      studentProgress,
      completionRate,
      recentCompletions,
    },
  });
});

// Get detailed student statistics
exports.getStudentStatistics = asyncHandler(async (req, res, next) => {
  const students = await User.find({ role: "student" })
    .select("fullName email university createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const studentsWithStats = await Promise.all(
    students.map(async (student) => {
      const readings = await Reading.find({ user: student._id }).lean();
      const completedReadings = readings.filter((r) => r.completed);
      const totalScore = completedReadings.reduce((sum, r) => sum + (r.score || 0), 0);
      const avgScore = completedReadings.length > 0 ? totalScore / completedReadings.length : 0;
      const totalTime = completedReadings.reduce((sum, r) => sum + (r.time || 0), 0);

      return {
        ...student,
        totalReadings: readings.length,
        completedReadings: completedReadings.length,
        inProgressReadings: readings.length - completedReadings.length,
        totalScore,
        avgScore: avgScore.toFixed(2),
        totalTime,
        readings: readings.map((r) => {
          const mapping = readingToLessonCategory[parseInt(r.reading)];
          return {
            _id: r._id,
            reading: r.reading,
            lesson: r.lesson ?? mapping?.lesson,
            category: r.category ?? mapping?.category,
            score: r.score,
            time: r.time,
            completed: r.completed,
            completedAt: r.completedAt,
            createdAt: r.createdAt,
          };
        }),
      };
    })
  );

  res.status(200).json({
    success: true,
    data: studentsWithStats,
  });
});

// Get individual student statistics by ID
exports.getStudentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse("Student ID is required", 400));
  }

  // Log activity
  await logActivity(
    req.user._id,
    "view_student",
    "student",
    id,
    `Viewed student details`,
    {}
  );

  const student = await User.findById(id).select("fullName email university createdAt role").lean();

  if (!student) {
    return next(new ErrorResponse("Student not found", 404));
  }

  if (student.role !== "student") {
    return next(new ErrorResponse("User is not a student", 400));
  }

  const readingsRaw = await Reading.find({ user: id }).sort({ completedAt: -1 }).lean();
  const readings = readingsRaw.map((r) => {
    const mapping = readingToLessonCategory[parseInt(r.reading)];
    return {
      ...r,
      lesson: r.lesson ?? mapping?.lesson,
      category: r.category ?? mapping?.category,
    };
  });
  const completedReadings = readings.filter((r) => r.completed);
  const inProgressReadings = readings.filter((r) => !r.completed);
  
  const totalScore = completedReadings.reduce((sum, r) => sum + (r.score || 0), 0);
  const avgScore = completedReadings.length > 0 ? totalScore / completedReadings.length : 0;
  const totalTime = completedReadings.reduce((sum, r) => sum + (r.time || 0), 0);
  const avgTime = completedReadings.length > 0 ? totalTime / completedReadings.length : 0;

  // Get score distribution
  const scoreDistribution = {};
  completedReadings.forEach((r) => {
    const score = r.score || 0;
    scoreDistribution[score] = (scoreDistribution[score] || 0) + 1;
  });

  // Get readings by lesson
  const readingsByLesson = {};
  readings.forEach((r) => {
    const lesson = r.lesson || "Unknown";
    if (!readingsByLesson[lesson]) {
      readingsByLesson[lesson] = {
        completed: 0,
        inProgress: 0,
        totalScore: 0,
        totalTime: 0,
      };
    }
    if (r.completed) {
      readingsByLesson[lesson].completed++;
      readingsByLesson[lesson].totalScore += r.score || 0;
      readingsByLesson[lesson].totalTime += r.time || 0;
    } else {
      readingsByLesson[lesson].inProgress++;
    }
  });

  res.status(200).json({
    success: true,
    data: {
      student: {
        _id: student._id,
        fullName: student.fullName,
        email: student.email,
        university: student.university,
        createdAt: student.createdAt,
      },
      statistics: {
        totalReadings: readings.length,
        completedReadings: completedReadings.length,
        inProgressReadings: inProgressReadings.length,
        totalScore,
        avgScore: avgScore.toFixed(2),
        totalTime,
        avgTime: Math.round(avgTime),
        scoreDistribution,
        readingsByLesson,
      },
      readings: readings.map((r) => ({
        _id: r._id,
        reading: r.reading,
        lesson: r.lesson,
        category: r.category,
        score: r.score,
        time: r.time,
        completed: r.completed,
        completedAt: r.completedAt,
        createdAt: r.createdAt,
      })),
    },
  });
});

// Create a new student
exports.createStudent = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, university } = req.body;

  if (!fullName || !email || !password || !university) {
    return next(new ErrorResponse("Please provide all required fields", 400));
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse("Email already exists", 400));
  }

  const student = await User.create({
    fullName,
    email,
    password,
    university,
    role: "student",
  });

  // Log activity
  await logActivity(
    req.user._id,
    "create_student",
    "student",
    student._id,
    `Created student: ${fullName} (${email})`,
    { fullName, email, university }
  );

  // Remove password from response
  student.password = undefined;

  res.status(201).json({
    success: true,
    data: student,
  });
});

// Update a student
exports.updateStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { fullName, email, password, university } = req.body;

  if (!id) {
    return next(new ErrorResponse("Student ID is required", 400));
  }

  const student = await User.findById(id);

  if (!student) {
    return next(new ErrorResponse("Student not found", 404));
  }

  if (student.role !== "student") {
    return next(new ErrorResponse("User is not a student", 400));
  }

  const oldData = {
    fullName: student.fullName,
    email: student.email,
    university: student.university,
  };

  // Update fields
  if (fullName) student.fullName = fullName;
  if (email) {
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      return next(new ErrorResponse("Email already exists", 400));
    }
    student.email = email;
  }
  if (university) student.university = university;
  if (password) student.password = password; // Will be hashed by pre-save hook

  await student.save();

  // Log activity
  await logActivity(
    req.user._id,
    "update_student",
    "student",
    student._id,
    `Updated student: ${student.fullName} (${student.email})`,
    { oldData, newData: { fullName: student.fullName, email: student.email, university: student.university } }
  );

  // Remove password from response
  student.password = undefined;

  res.status(200).json({
    success: true,
    data: student,
  });
});

// Delete a student
exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse("Student ID is required", 400));
  }

  const student = await User.findById(id);

  if (!student) {
    return next(new ErrorResponse("Student not found", 404));
  }

  if (student.role !== "student") {
    return next(new ErrorResponse("User is not a student", 400));
  }

  const studentInfo = {
    fullName: student.fullName,
    email: student.email,
    university: student.university,
  };

  // Count readings before deletion
  const readingsCount = await Reading.countDocuments({ user: id });

  // Delete all readings associated with this student
  await Reading.deleteMany({ user: id });

  // Delete the student
  await User.findByIdAndDelete(id);

  // Log activity
  await logActivity(
    req.user._id,
    "delete_student",
    "student",
    id,
    `Deleted student: ${studentInfo.fullName} (${studentInfo.email})`,
    { studentInfo, readingsDeleted: readingsCount }
  );

  res.status(200).json({
    success: true,
    message: "Student and all associated data deleted successfully",
  });
});

// Get activity logs
exports.getActivityLogs = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 50, action, startDate, endDate } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query = {};
  if (action) query.action = action;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const logs = await ActivityLog.find(query)
    .populate("admin", "fullName email")
    .populate("targetId", "fullName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await ActivityLog.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

// Export students data
exports.exportStudents = asyncHandler(async (req, res, next) => {
  const students = await User.find({ role: "student" })
    .select("fullName email university createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const studentsWithStats = await Promise.all(
    students.map(async (student) => {
      const readings = await Reading.find({ user: student._id }).lean();
      const completedReadings = readings.filter((r) => r.completed);
      const totalScore = completedReadings.reduce((sum, r) => sum + (r.score || 0), 0);
      const avgScore = completedReadings.length > 0 ? totalScore / completedReadings.length : 0;

      return {
        "Full Name": student.fullName,
        "Email": student.email,
        "University": student.university,
        "Total Readings": readings.length,
        "Completed Readings": completedReadings.length,
        "In Progress Readings": readings.length - completedReadings.length,
        "Average Score": avgScore.toFixed(2),
        "Total Score": totalScore,
        "Created At": new Date(student.createdAt).toLocaleString(),
      };
    })
  );

  // Convert to CSV format
  if (studentsWithStats.length === 0) {
    return res.status(200).json({
      success: true,
      data: "No students found",
    });
  }

  const headers = Object.keys(studentsWithStats[0]);
  const csvRows = [
    headers.join(","),
    ...studentsWithStats.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    ),
  ];

  const csv = csvRows.join("\n");

  // Log activity
  await logActivity(
    req.user._id,
    "export_students",
    "statistics",
    null,
    `Exported ${studentsWithStats.length} students`,
    { count: studentsWithStats.length }
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=students_${Date.now()}.csv`);
  res.status(200).send(csv);
});

// Export statistics
exports.exportStatistics = asyncHandler(async (req, res, next) => {
  // Get statistics data
  await backfillReadingTitlesIfNeeded();

  const totalStudents = await User.countDocuments({ role: "student" });

  const totalReadingsAgg = await Reading.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    { $match: { "userInfo.role": "student", completed: true } },
    { $count: "count" },
  ]);
  const totalReadings = totalReadingsAgg[0]?.count || 0;

  const studentsByUniversity = await User.aggregate([
    { $match: { role: "student" } },
    {
      $group: {
        _id: "$university",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const completionRate = await Reading.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    { $match: { "userInfo.role": "student" } },
    {
      $group: {
        _id: "$reading",
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
        },
        avgScore: { $avg: { $cond: [{ $eq: ["$completed", true] }, "$score", null] } },
        readingTitle: { $first: "$readingTitle" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Prepare CSV data
  const csvRows = [
    ["Statistic", "Value"],
    ["Total Students", totalStudents],
    ["Total Readings Completed", totalReadings],
    ["", ""],
    ["University", "Student Count"],
    ...studentsByUniversity.map((uni) => [uni._id, uni.count]),
    ["", ""],
    ["Reading", "Total", "Completed", "Completion Rate", "Average Score"],
    ...completionRate.map((r) => [
      r.readingTitle || `Reading ${r._id}`,
      r.total,
      r.completed,
      r.total > 0 ? ((r.completed / r.total) * 100).toFixed(2) + "%" : "0%",
      r.avgScore ? r.avgScore.toFixed(2) : "N/A",
    ]),
  ];

  const csv = csvRows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell);
          if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    )
    .join("\n");

  // Log activity
  await logActivity(
    req.user._id,
    "export_statistics",
    "statistics",
    null,
    "Exported statistics report",
    { totalStudents, totalReadings }
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=statistics_${Date.now()}.csv`);
  res.status(200).send(csv);
});
