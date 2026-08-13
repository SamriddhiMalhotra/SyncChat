import uploadOnCloudinary from "../config/cloudinary.js"
import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js"

export const sendMessage = async (req, res) => {
  try {
    let sender = req.userId
    let { receiver } = req.params
    let message = req.body.message
    let image

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path)
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] }
    })

    let newMessage = await Message.create({
      sender, receiver, message, image
    })

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id]
      })
    } else {
      conversation.messages.push(newMessage._id)
      await conversation.save()
    }
    //to get receiver socket id using the function we created .as communication happen through socket id.
    const receiverSocketid = getReceiverSocketId(receiver)
    if (receiverSocketid) {
      io.to(receiverSocketid).emit("newMessage", newMessage)
    }
    return res.status(201).json(newMessage)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: `message error is ${error}` })
  }
}


export const getMessages = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] }
    }).populate("messages")

    if (!conversation) {
      return res.status(400).json({ message: "conversation not found" })
    }
    //updating unread messages
    const result =await Message.updateMany(
      {
        sender: receiver,
        receiver: sender,
        seen: false,
      },
      {
        $set: { seen: true },
      }
    );
    //NOTIFYING SENDER IN REAL TIME
    if (result.modifiedCount > 0){
     const receiverSocketId = getReceiverSocketId(receiver);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messagesSeen", {
        seenBy: sender,
      });
    }}
   

    return res.status(200).json(conversation?.messages)
  } catch (error) {
    return res.status(500).json({ message: `get message error ${error}` })
  }
}//sender variable = currently logged-in user