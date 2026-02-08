const logger = require("../utils/logger");

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

    res.json(chat);
  } catch (err) {
    console.log(`${err}`);
    logger.error(`GetChatById Error: ${err.message}`);
    res.status(400).json({ error: `${err}` });
  }
};

module.exports = { getChatById };
