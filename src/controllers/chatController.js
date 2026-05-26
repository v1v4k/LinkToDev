const logger = require("../utils/logger");
const Chat = require("../models/chat");

const getChatById = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const { targetUserId } = req.params;

    logger.info(
      `Chat access attempt: User ${userId} -> Target ${targetUserId}`,
    );

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({ path: "messages.senderId", select: "firstName lastName" });

    if (!chat) {
      logger.info(`Creating NEW chat between: ${userId} and ${targetUserId}`);
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    } else {
      logger.info(`Existing chat retrieved: ${chat._id}`);
    }

    res.json({ message: "Chat retrieved successfully", data: chat });
  } catch (err) {
    logger.error(`GetChatById Error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getChatById };
