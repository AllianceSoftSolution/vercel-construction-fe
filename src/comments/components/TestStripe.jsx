import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const CARD_OPTIONS = {
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#333",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

// PaymentForm Component to handle payments
const TestStripe = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the card details from the form
    const cardElement = elements.getElement(CardElement);

    // Request the PaymentIntent from your backend
    const response = await fetch(
      "http://localhost:5000/api/stripe/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }), // Send the amount to the backend
      }
    );

    const data = await response.json();
    console.log(data.data.clientSecret);

    // Confirm the payment using Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      data.data.clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setStatusMessage(`Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setStatusMessage("Payment succeeded!");
    }
  };
  const handleCheckout = async () => {
    const response = await fetch(
      "https://tax-backend.vercel.app/api/proposal/create-checkout-session/66fa9d4b2562e182ab9f4a57",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      const stripe = await loadStripe(
        "pk_test_51Q4dcjJatabAsKFPopmwytEttwS1ZyYqIt4qZ6t2l93sV0Fitp87jo5nKRNGJCkMt5vXZn5cRhX1aPliwC658HCq00pZ58VcVz"
      );
      stripe.redirectToCheckout({ sessionId: data.data.sessionId });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <button
        onClick={() => handleCheckout()}
        className="bg-red-400 text-white px-4 py-2"
      >
        Checkout Session
      </button>
      {/* <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Make a Payment
        </h2>

        <div className="flex flex-col">
          <label htmlFor="amount" className="text-sm font-medium mb-2">
            Enter Payment Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter amount"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="card-element" className="text-sm font-medium mb-2">
            Card Details
          </label>
          <div
            id="card-element"
            className="border border-gray-300 p-4 rounded-md"
          >
            <CardElement options={CARD_OPTIONS} />
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Pay
        </button>
      </form> */}
      <p className="text-center mt-4">{statusMessage}</p>
    </div>
  );
};

export default TestStripe;
