import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

function MockPaymentPage() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/balance`, { withCredentials: true })
      .then((res) => setBalance(res.data.balance));
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post(
        `${API_BASE}/api/balance/add`,
        { amount: Number(amount) },
        { withCredentials: true }
      );
      setBalance(res.data.balance);
      setMsg(res.data.msg);
      setAmount(0);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Payment failed");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Mock Payment Page</h2>
      <p className="mb-2">Your Balance: <span className="font-semibold">{balance} AZN</span></p>
      <form onSubmit={handlePay} className="mb-4">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="border px-2 py-1 mr-2"
          placeholder="Amount"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">
          Add Funds
        </button>
      </form>
      {msg && <div className="text-blue-700">{msg}</div>}
    </div>
  );
}

export default MockPaymentPage;