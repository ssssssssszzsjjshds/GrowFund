import Message from "../models/Message.js";
import User from "../models/User.js";

// Send a message from the logged-in user to a receiver
const sendMessage = async (req, res) => {
  const sender = req.user.id;
  const { receiver, content } = req.body;
  if (!receiver || !content) {
    return res.status(400).json({ msg: "Receiver and content are required." });
  }
  if (receiver === sender) {
    return res.status(400).json({ msg: "You can't message yourself." });
  }
  const message = new Message({ sender, receiver, content });
  await message.save();
  res.status(201).json(message);
};

// Get all messages between logged-in user and another user (sorted oldest to newest)
const getConversation = async (req, res) => {
  const user1 = req.user.id;
  const user2 = req.params.userId;
  if (!user2) return res.status(400).json({ msg: "userId param required." });
  // Only allow users to see their own messages
  if (user1 === user2) {
    return res
      .status(400)
      .json({ msg: "userId must be different from your own." });
  }
  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 },
    ],
  }).sort("createdAt");
  res.json(messages);
};

const getConversationsList = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all messages where the user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // Get unique user IDs that have messaged with the current user (excluding self)
    const userIds = [
      ...new Set(
        messages.flatMap(msg => [
          msg.sender.toString(),
          msg.receiver.toString()
        ])
      )
    ].filter(id => id !== userId);

    // Fetch those users' info
    const users = await User.find({ _id: { $in: userIds } }).select("_id name avatar");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load conversations" });
  }
};


export { sendMessage, getConversation, getConversationsList };