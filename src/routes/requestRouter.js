const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  sendConnectionRequest,
  reviewConnectionRequest,
  getConnectionStatus,
} = require("../controllers/requestController");

// sendConnectionRequest API
requestRouter.post(
  "/sendConnectionRequest/:status/:toUserId",
  userAuth,
  sendConnectionRequest,
);

//reviewConnectionRequest API

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  reviewConnectionRequest,
);

requestRouter.get(
  "/user/connection-status/:userId",
  userAuth,
  getConnectionStatus,
);
module.exports = requestRouter;
