const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
require("dotenv").config();

const auth = require("./routes/auth");

const app = express();

app.use(
  bodyParser.json({
    limit: "2000mb",
  })
);

// Cookie parser
app.use(cookieParser());
app.use(morgan("dev"));
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/v1/auth", auth);

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
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();
