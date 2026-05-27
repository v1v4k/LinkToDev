require("dotenv").config();
require("./config/passport");

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const passport = require("passport");

const connectDB = require("./config/database");
const intializeSocket = require("./utils/socket");
const logger = require("./utils/logger");
require("./utils/cronJob");

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const { userRouter } = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const paymentRouter = require("./routes/paymentRouter");
const webhookRouter = require("./routes/webhookRouter");

const app = express();
const port = process.env.PORT_NO;

const server = http.createServer(app);
intializeSocket(server);

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many login attempts, please try again later.",
  },
});

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  webhookRouter,
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
  });
});
app.use("/login", authLimiter);
app.use("/signup", authLimiter);

app.use("/", apiLimiter);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", paymentRouter);

const shutdown = () => {
  logger.info("Shutting down gracefully...");
  server.close(() => {
    logger.info("HTTP server closed");
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  });

  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

connectDB()
  .then(() => {
    logger.info("Database connection successfully established");
    server.listen(port, () => {
      logger.info(`server is up and running at port ${port}`);
    });
  })
  .catch((err) => {
    logger.error(`Database cannot be connected+${err}`);
    process.exit(1);
  });
