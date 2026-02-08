const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  sendConnectionRequest,
  reviewConnectionRequest,
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

module.exports = requestRouter;
