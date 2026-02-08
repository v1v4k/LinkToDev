const express = require("express");
const { userAuth } = require("../middlewares/auth");

const { getChatById } = require("../controllers/chatController");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, getChatById);

module.exports = chatRouter;
