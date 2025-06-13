import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: "Test User" },
      },
    });

    if (result.error) {
      setResult("❌ Erreur : " + result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setResult("✅ Paiement réussi !");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Paiement en cours..." : "Payer"}
      </button>
      {result && <p>{result}</p>}
    </form>
  );
}
