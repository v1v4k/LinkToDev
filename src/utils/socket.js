const socket = require("socket.io");

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
      const roomId = [userId, targetUserId].sort().join("$"); // Generate a unique room ID for the two users
      console.log(`${firstName} joined room : ${roomId}`);
      socket.join(roomId); // Join the specified chat room
    });

    // Listen for a message sent by a user
    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("$");
      console.log(firstName + text);

      //emit an event to users in the room
      io.to(roomId).emit("messageReceived", { firstName, text });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = intializeSocket;
