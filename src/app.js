require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = process.env.PORT_NO;
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const { userRouter } = require("./routes/userRouter");
const mfaAuthRouter = require("./routes/mfaAuth");
const cors = require("cors");

const http = require("http");
const intializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chatRouter");
const paymentRouter = require("./routes/paymentRouter");
const webhookRouter = require("./routes/webhookRouter");

const server = http.createServer(app);
intializeSocket(server);

require("./utils/cronJob");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  "/api/webhook", 
  express.raw({ type: "application/json" }), 
  webhookRouter
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", mfaAuthRouter)
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", paymentRouter)

connectDB()
  .then(() => {
    console.log("Database connection successfully established");
    server.listen(port, () => {
      console.log(`server is up and running at port ${port}`);
    });
  })
  .catch((err) => {
    console.error(`Database cannot be connected+${err}`);
  });
