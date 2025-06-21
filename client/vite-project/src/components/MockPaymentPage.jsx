import React from "react";
import axios from "axios";
import FakeStripePaymentElement from "./FakeStripePaymentElement";

const API_BASE = "http://localhost:5000";

export default function MockPaymentPage() {
  const [balance, setBalance] = React.useState(0);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    axios
      .get(`${API_BASE}/api/balance`, { withCredentials: true })
      .then((res) => setBalance(res.data.balance));
  }, []);

  // Now receives the amount argument from the child component
  const handlePay = async (amount) => {
    setMsg("");
    try {
      const res = await axios.post(
        `${API_BASE}/api/balance/add`,
        { amount }, // uses the amount passed up from FakeStripePaymentElement
        { withCredentials: true }
      );
      setBalance(res.data.balance);
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Payment failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-center text-[#635bff]">
        Stripe-like Payment
      </h2>
      <div className="flex justify-center items-center mb-2">
        <svg height="24" width="60" viewBox="0 0 60 24">
          <rect x="0" y="5" width="60" height="14" rx="7" fill="#635bff" />
        </svg>
      </div>
      <div className="mb-4 text-center">
        <span className="text-gray-600">Your Balance:</span>{" "}
        <span className="font-semibold text-[#635bff]">{balance} AZN</span>
      </div>
      {/* Now we do not hardcode the amount */}
      <FakeStripePaymentElement onPay={handlePay} />
      {msg && <div className="text-blue-700 mt-2 text-center">{msg}</div>}
      <div className="mt-6 text-xs text-gray-500 text-center">
        <div>
          <strong>Test Card:</strong> 4242 4242 4242 4242 (any future expiry
          &amp; CVV)
        </div>
        <div>This is a mock payment page. No real transactions are made.</div>
      </div>
    </div>
  );
}
