const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const intializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // Listen for incoming socket connections
  io.on("connection", (socket) => {
    // Listen for a user joining a private chat room
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId); // Generate a unique room ID for the two users
      // console.log(`${firstName} joined room : ${roomId}`);
      socket.join(roomId); // Join the specified chat room
    });

    // Listen for a message sent by a user
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
           //console.log(`${firstName}: ${text}`);

          //saving messages to DB
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if(!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          //emit an event to users in the room
          io.to(roomId).emit("messageReceived", { firstName, text });
        } catch (err) {
          console.log(`${err}`);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = intializeSocket;
