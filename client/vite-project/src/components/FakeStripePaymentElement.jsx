import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

// Simple Luhn algorithm for card validation
function validateCardNumber(value) {
  const v = value.replace(/\s+/g, "");
  if (!/^\d{16}$/.test(v)) return false;
  let sum = 0,
    shouldDouble = false;
  for (let i = v.length - 1; i >= 0; i--) {
    let digit = parseInt(v.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

const countryList = [
  { value: "AZ", label: "Azerbaijan" },
  { value: "US", label: "United States" },
  { value: "TR", label: "Turkey" },
  // Add more countries as needed
];

export default function FakeStripePaymentElement({ onPay }) {
  const [amount, setAmount] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [country, setCountry] = useState("AZ");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [paying, setPaying] = useState(false);

  // Format card input as "1234 5678 9012 3456"
  function formatCard(val) {
    return val
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function handleCardChange(e) {
    setError("");
    setCard(formatCard(e.target.value));
  }

  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    if (field === "card") {
      const valid = validateCardNumber(card.replace(/\s/g, ""));
      if (!valid) setError("Your card number is invalid.");
      else setError("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ amount: true, card: true, expiry: true, cvc: true });
    let valid = true;

    if (!amount || isNaN(Number(amount)) || Number(amount) < 1) {
      setError("Please enter a valid amount (minimum 1 AZN).");
      valid = false;
    } else if (!validateCardNumber(card.replace(/\s/g, ""))) {
      setError("Your card number is invalid.");
      valid = false;
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      setError("Please enter a valid expiration date.");
      valid = false;
    } else if (!/^\d{3,4}$/.test(cvc)) {
      setError("Please enter a valid CVC.");
      valid = false;
    } else {
      setError("");
    }

    if (valid) {
      setPaying(true);
      setTimeout(() => {
        setPaying(false);
        if (onPay) onPay(Number(amount));
        toast.success("Payment successful!");
      }, 1200);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(50,50,93,0.06)",
        padding: 24,
        maxWidth: 400,
        margin: "40px auto",
        border: "1px solid #e5e7eb",
      }}
    >
      <Toaster />
      <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 16 }}>
        Payment method
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <span style={{ color: "#635bff", fontWeight: 500, marginRight: 16 }}>
          <svg width="20" height="20" style={{ verticalAlign: "middle" }}>
            <rect x="0" y="6" width="20" height="8" rx="4" fill="#635bff" />
          </svg>{" "}
          Card
        </span>
        <span style={{ color: "#00b86b", fontWeight: 500 }}>
          <svg
            width="16"
            height="16"
            style={{ verticalAlign: "middle", marginRight: 4 }}
          >
            <path
              d="M2 8l4 4 8-8"
              stroke="#00b86b"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          Secure, 1-click checkout with Link
        </span>
      </div>
      {/* Amount */}
      <label
        style={{
          fontWeight: 500,
          fontSize: 14,
          display: "block",
          marginBottom: 4,
        }}
      >
        Amount (AZN)
      </label>
      <input
        type="number"
        min="1"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
        onBlur={() => handleBlur("amount")}
        style={{
          width: "100%",
          padding: "12px",
          border:
            !amount && touched.amount
              ? "2px solid #e25950"
              : "1px solid #cfd7df",
          borderRadius: 8,
          fontSize: 16,
          marginBottom: 12,
        }}
      />
      {/* Card Number */}
      <label
        style={{
          fontWeight: 500,
          fontSize: 14,
          display: "block",
          marginBottom: 4,
        }}
      >
        Card number
      </label>
      <div style={{ position: "relative", marginBottom: 4 }}>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={card}
          onChange={handleCardChange}
          onBlur={() => handleBlur("card")}
          style={{
            width: "100%",
            padding: "12px 44px 12px 12px",
            border:
              error && touched.card ? "2px solid #e25950" : "1px solid #cfd7df",
            borderRadius: 8,
            fontSize: 16,
            outline: error && touched.card ? "2px solid #e25950" : "none",
          }}
          maxLength={19}
          autoComplete="cc-number"
        />
        {/* Card icon */}
        <span style={{ position: "absolute", right: 12, top: 12 }}>
          {error && touched.card ? (
            // Warning icon
            <svg width="24" height="24">
              <rect x="0" y="0" width="24" height="24" rx="6" fill="#fdecea" />
              <path
                d="M12 8v4m0 4h.01"
                stroke="#e25950"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1" fill="#e25950" />
            </svg>
          ) : (
            // Card icon
            <svg width="24" height="24">
              <rect x="2" y="6" width="20" height="12" rx="4" fill="#e0e3ea" />
              <rect x="4" y="8" width="16" height="4" rx="2" fill="#cfd7df" />
            </svg>
          )}
        </span>
      </div>
      {/* Expiry and CVC */}
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <label
            style={{
              fontWeight: 500,
              fontSize: 14,
              display: "block",
              marginBottom: 4,
            }}
          >
            Expiration date
          </label>
          <input
            type="text"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) =>
              setExpiry(e.target.value.replace(/[^0-9/]/g, "").slice(0, 5))
            }
            onBlur={() => handleBlur("expiry")}
            style={{
              width: "100%",
              padding: "12px",
              border:
                !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) && touched.expiry
                  ? "2px solid #e25950"
                  : "1px solid #cfd7df",
              borderRadius: 8,
              fontSize: 16,
            }}
            maxLength={5}
            autoComplete="cc-exp"
          />
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <label
            style={{
              fontWeight: 500,
              fontSize: 14,
              display: "block",
              marginBottom: 4,
            }}
          >
            Security code
          </label>
          <input
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) =>
              setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            onBlur={() => handleBlur("cvc")}
            style={{
              width: "100%",
              padding: "12px 44px 12px 12px",
              border:
                !/^\d{3,4}$/.test(cvc) && touched.cvc
                  ? "2px solid #e25950"
                  : "1px solid #cfd7df",
              borderRadius: 8,
              fontSize: 16,
            }}
            maxLength={4}
            autoComplete="cc-csc"
          />
          {/* CVC icon */}
          <span style={{ position: "absolute", right: 12, top: 36 }}>
            <svg width="24" height="24">
              <rect x="2" y="6" width="20" height="12" rx="4" fill="#e0e3ea" />
              <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="10"
                fill="#635bff"
              >
                123
              </text>
            </svg>
          </span>
        </div>
      </div>
      {/* Country */}
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            fontWeight: 500,
            fontSize: 14,
            display: "block",
            marginBottom: 4,
          }}
        >
          Country
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #cfd7df",
            borderRadius: 8,
            fontSize: 16,
            background: "#f6f9fc",
          }}
        >
          {countryList.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      {/* Error Message */}
      {error && (
        <div style={{ color: "#e25950", fontSize: 13, marginBottom: 8 }}>
          {error}
        </div>
      )}
      {/* Submit */}
      <button
        type="submit"
        disabled={paying}
        style={{
          width: "100%",
          padding: "12px",
          background: "#635bff",
          color: "#fff",
          fontWeight: 600,
          fontSize: 16,
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          boxShadow: "0 1px 3px rgba(80,80,160,0.07)",
        }}
      >
        {paying ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}
