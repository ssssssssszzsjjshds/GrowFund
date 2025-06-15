import React from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { CardNumberFields } from "./CardNumberFields";

const API_BASE = "http://localhost:5000";

const PaymentSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Amount must be a number")
    .min(1, "Amount must be at least 1 AZN")
    .required("Amount is required"),
  card1: Yup.string()
    .matches(/^\d{4}$/, "Must be 4 digits")
    .required("Required"),
  card2: Yup.string()
    .matches(/^\d{4}$/, "Must be 4 digits")
    .required("Required"),
  card3: Yup.string()
    .matches(/^\d{4}$/, "Must be 4 digits")
    .required("Required"),
  card4: Yup.string()
    .matches(/^\d{4}$/, "Must be 4 digits")
    .required("Required"),
  expiry: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Expiry must be MM/YY")
    .required("Expiry date is required"),
  cvv: Yup.string()
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
    .required("CVV is required"),
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Cardholder name is required"),
});

// Helper to combine card sections
const CardNumberWatcher = () => {
  const { values, setFieldValue } = useFormikContext();
  React.useEffect(() => {
    const cardNumber = [
      values.card1,
      values.card2,
      values.card3,
      values.card4,
    ].join("");
    setFieldValue("cardNumber", cardNumber, false);
  }, [values.card1, values.card2, values.card3, values.card4, setFieldValue]);
  return null;
};
export default function MockPaymentPage() {
  const [balance, setBalance] = React.useState(0);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    axios
      .get(`${API_BASE}/api/balance`, { withCredentials: true })
      .then((res) => setBalance(res.data.balance));
  }, []);

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Mock Payment Page</h2>
      <p className="mb-4 text-center">
        Your Balance: <span className="font-semibold">{balance} AZN</span>
      </p>
      <Formik
        initialValues={{
          amount: "",
          card1: "",
          card2: "",
          card3: "",
          card4: "",
          cardNumber: "",
          expiry: "",
          cvv: "",
          name: "",
        }}
        validationSchema={PaymentSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setMsg("");
          try {
            const res = await axios.post(
              `${API_BASE}/api/balance/add`,
              { amount: Number(values.amount) },
              { withCredentials: true }
            );
            setBalance(res.data.balance);
            setMsg(res.data.msg);
            resetForm();
          } catch (err) {
            setMsg(err.response?.data?.msg || "Payment failed");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <CardNumberWatcher />
            <div>
              <label className="block text-sm font-medium mb-1">
                Amount (AZN)
              </label>
              <Field
                name="amount"
                type="number"
                min="1"
                className="w-full border rounded px-3 py-2"
                placeholder="Amount"
              />
              <ErrorMessage
                name="amount"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cardholder Name
              </label>
              <Field
                name="name"
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Name on Card"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            <div>
  <label className="block text-sm font-medium mb-1">Card Number</label>
  <CardNumberFields />
  <div className="flex space-x-2 text-xs text-red-600 mt-1">
    <ErrorMessage name="card1" component="div" />
    <ErrorMessage name="card2" component="div" />
    <ErrorMessage name="card3" component="div" />
    <ErrorMessage name="card4" component="div" />
  </div>
</div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Expiry (MM/YY)
                </label>
                <Field
                  name="expiry"
                  type="text"
                  autoComplete="cc-exp"
                  className="w-full border rounded px-3 py-2"
                  placeholder="MM/YY"
                  inputMode="numeric"
                  maxLength={5}
                />
                <ErrorMessage
                  name="expiry"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">CVV</label>
                <Field
                  name="cvv"
                  type="password"
                  autoComplete="cc-csc"
                  className="w-full border rounded px-3 py-2"
                  placeholder="CVV"
                  inputMode="numeric"
                  maxLength={4}
                />
                <ErrorMessage
                  name="cvv"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              {isSubmitting ? "Processing..." : "Add Funds"}
            </button>
            {msg && <div className="text-blue-700 mt-2 text-center">{msg}</div>}
          </Form>
        )}
      </Formik>
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
