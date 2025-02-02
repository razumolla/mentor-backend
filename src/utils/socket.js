const socket = require('socket.io');

const initializeSocket = (server) => {

  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + "Join room:", roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("_");

      console.log(firstName + " Send new message to room:", roomId + text);

      io.to(roomId).emit("messageReceived", { firstName, text });
    });

    socket.on("disconnect", () => { });
  });

}
module.exports = initializeSocket;