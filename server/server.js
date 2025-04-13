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

// Cookie parser
app.use(cookieParser());
app.use(morgan("dev"));
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/readings", reading);

// error handler
app.use(errorHandler);

// start server
(async () => {
  try {
    const connection = await connectDB();
    console.log(`MongoDB Connected: ${connection.connection.host}`);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () =>
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      )
    );
  } catch (error) {
    console.log(error);
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
})();
