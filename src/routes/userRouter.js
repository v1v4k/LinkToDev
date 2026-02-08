const express = require("express");
const { userAuth } = require("../middlewares/auth");

const {
  getConnections,
  getFeed,
  getSearch,
  getRequests,
} = require("../controllers/userController");
const userRouter = express.Router();

// connections requests recieved to loggedInUser  API (receiver end)
userRouter.get("/user/requests/received", userAuth, getRequests);

// user connections API
userRouter.get("/user/connections", userAuth, getConnections);

// feed API
userRouter.get("/user/feed", userAuth, getFeed);

// search API
userRouter.get("/user/search", userAuth, getSearch);
module.exports = { userRouter };
