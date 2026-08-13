import Message from "../models/message.model.js";
import http from "http"
import express from "express"
import { Server } from "socket.io"
let app = express()

//Server of http
const httpserver = http.createServer(app)
//socket.io server
const io = new Server(httpserver, {
  cors: {
    origin: "http://localhost:5174"
  }
})

const userSocketMap = {}
//function to get socketid using userid
export const getReceiverSocketId = (receiver) => {
  return userSocketMap[receiver]
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  if (userId != undefined) {
    userSocketMap[userId] = socket.id
    //userId:socketid
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })

  //TYPING 
  socket.on("typing", ({ receiverId, senderId }) => {
    if (!receiverId || !senderId) return;
    const receiverSocketId = getReceiverSocketId(receiverId)

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId })
    }
  })
//AND STOP TYPING
  socket.on("stopTyping", ({ receiverId, senderId }) => {
    if (!receiverId || !senderId) return;
    const receiverSocketId = getReceiverSocketId(receiverId)

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStopTyping", { senderId })
    }
  })

  //RECEIVING/LISTENING REAL TIME READ RECEIPT and THEN EMITTING TO SENDER.
  // REAL-TIME READ RECEIPT
socket.on("markMessageSeen", async ({ messageId }) => {
  try {
    if (!messageId) return;

    // Find the message and mark it as seen
    const message = await Message.findByIdAndUpdate(
      messageId,
      { seen: true },
      { new: true }//retun updates msg
    );

    if (!message) return;

    // Get the sender's socket ID
    const senderSocketId = getReceiverSocketId(message.sender.toString());

    // Notify sender in real time
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageSeenByReceiver", {
        messageId: message._id
      });
    }

  } catch (error) {
    console.log("Real-time seen error:", error);
  }
});

})
export { app, httpserver, io }



//io.emit("hello","hello ayush")
//socket=user//as user connected the socket.io initializes it socketid which we get inside this socket using which we do real time communication.
//event name=hello