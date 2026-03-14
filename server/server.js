const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
require("./cron");

require("dotenv").config();

const auth = require("./routes/auth");
const reading = require("./routes/reading");
const admin = require("./routes/admin");
const questionnaire = require("./routes/questionnaire");
const ai = require("./routes/ai");
const { protect } = require("./middleware/auth");
const asyncHandler = require("./middleware/async");
const AIConversation = require("./models/AIConversation");
const AIMessage = require("./models/AIMessage");

const READING_IDS_AI = ["1", "2", "3", "4", "5", "6", "7"];
const HISTORY_LIMIT = 100;

const app = express();

app.use(
  bodyParser.json({
    limit: "2000mb",
  })
);

// Set security headers
app.use(helmet());

// Enable CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://espreading.vercel.app",
  "https://espreading.uz",
  "https://espreading.onrender.com",
  "https://www.espreading.onrender.com",
  "https://www.espreading.uz",
  "https://www.espreading.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Cookie parser
app.use(cookieParser());
app.use(morgan("dev"));
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// AI chat history - inline so route is always registered (before ai router)
app.get(
  "/api/v1/ai/history",
  protect,
  asyncHandler(async (req, res) => {
    const readingId = req.query.readingId;
    if (!readingId || !READING_IDS_AI.includes(String(readingId))) {
      return res.status(400).json({ success: false, message: "Invalid or missing readingId" });
    }
    const userId = req.user._id;
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
  })
);

// Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/readings", reading);
app.use("/api/v1/admin", admin);
app.use("/api/v1/questionnaire", questionnaire);
app.use("/api/v1/ai", ai);

// error handler
app.use(errorHandler);

// start server
(async () => {
  try {
    const connection = await connectDB();
    console.log(`MongoDB Connected: ${connection.connection.host}`);

    // Ensure AI setting exists for admin toggle
    const Setting = require("./models/Setting");
    await Setting.findOneAndUpdate(
      { key: "ai_enabled" },
      { $setOnInsert: { key: "ai_enabled", value: true } },
      { upsert: true, new: true }
    );

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log("GET /api/v1/ai/history registered for chat history");
    });
  } catch (error) {
    console.log(error);
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
})();
