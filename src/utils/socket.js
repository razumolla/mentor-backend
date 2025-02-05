const socket = require('socket.io');
const crypto = require('crypto');
const { Chat } = require('../models/chat');
const ConnectionRequest = require('../models/connectionRequest');

const getSecreatRoomId = (userId, targetUserId) => {
  return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join("$"))
    .digest('hex');
}

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecreatRoomId(userId, targetUserId);
      console.log(firstName + "Join room:", roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text,time }) => {
        try {
          const roomId = getSecreatRoomId(userId, targetUserId);
          console.log(firstName + " Send new message to room:", roomId + text);

          //chek if the userId and targetUserId are friends
          const isFriend = await ConnectionRequest.findOne({
            $or: [
              { fromUserId: userId, toUserId: targetUserId },
              { fromUserId: targetUserId, toUserId: userId }
            ],
            status: "accepted"
          });
          if (!isFriend) {
            return;
          }

          // Save message to database
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: []
            });
          }
          chat.messages.push({ senderId: userId, text,time });
          await chat.save();

          io.to(roomId).emit("messageReceived", { firstName, lastName, text,time });
        } catch (error) {
          console.log(error);
        }
      });

    socket.on("disconnect", () => { });
  });

}
module.exports = initializeSocket;