import User from "../models/User.js";

// Get current user's balance
export const getBalance = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ balance: user.balance });
};

// Add funds (mock payment)
export const addBalance = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ msg: "Invalid amount" });

  // Simulate payment processing...
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $inc: { balance: amount } },
    { new: true }
  );
  res.json({ balance: user.balance, msg: "Mock payment successful!" });
};