import { StatusCodes } from "http-status-codes";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const createMessage = async (req, res) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });
  console.log(req.params.id);
  const savedMessage = await newMessage.save();
  await Conversation.findOneAndUpdate(
    { id: req.body.conversationId },
    {
      $set: {
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
        lastMessage: req.body.desc,
      },
    },
    { new: true }
  );

  res.status(StatusCodes.CREATED).json(savedMessage);
};
export const getMessages = async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.id });

  res.status(StatusCodes.OK).json(messages);
};
