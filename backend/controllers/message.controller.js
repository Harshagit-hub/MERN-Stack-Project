import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage: text } = req.body;

    // 1) conversation find/create
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // 2) message create (with conversationId)
    const newMessage = await Message.create({
      senderId,
      receiverId,
      conversationId: conversation._id, // ✅
      message: text,
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

// sender details for popup
const fromUser = await User.findById(senderId).select("username profilePicture");

// emit message with extra info
const receiverSocketId = getReceiverSocketId(receiverId);
if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage", {
        ...newMessage.toObject(),
        conversationId: conversation._id, // ✅ required
        fromUser,                         // ✅ for popup
        type: "message",                  // optional
    });
}


    return res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    const messages = conversation ? conversation.messages : [];
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};



