import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "@/security/auth/Api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51RZJW6R0DGdGa8DnXOxXjp8zVdm5sKyPdQxFkRU2tjG0wnJweCVrtCXy0mmWinoFN3naqELUUjOGqAq6FZe7KNqq00YacXSFz5"); // 🔐 Remplace par ta vraie clé publique

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const { clearCart } = useCart();   
  const navigate = useNavigate(); 

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await api.post("/payment", {
          amount: Math.round(totalAmount), // Stripe attend des centimes
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("❌ Erreur lors de la création du paiement :", error);
      }
    };

    if (totalAmount > 0) {
      createPaymentIntent();
    }
  }, [totalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
        alert("❌ Paiement échoué : " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setPaymentSucceeded(true);
        alert("✅ Paiement effectué avec succès !");

        // 🧾 Enregistrement des commandes dans la base de données
        try {
            const cartRes = await api.get("/cart"); // récupère le panier backend
            const cartItems = cartRes.data;
    
            await api.post("/orders", {
            items: cartItems.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
            })),
            });
    
            await clearCart(); // ✅ Vide le panier local (et potentiellement backend si lié)
            navigate("/shop");
        } catch (error) {
            console.error("❌ Erreur lors de l'enregistrement des commandes :", error);
            alert("Erreur lors de la sauvegarde de la commande");
        }
      }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <CardElement className="p-2 border rounded" />
      <Button type="submit" disabled={!stripe || paymentSucceeded}>
        Payer {totalAmount.toFixed(2)} €
      </Button>
    </form>
  );
};

const Checkout = () => {
  const { cartItems } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Récapitulatif du panier</h2>
      <ul className="space-y-2">
        {cartItems.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.quantity} × {item.product.name}
            </span>
            <span>{(item.product.price * item.quantity).toFixed(2)} €</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-right font-bold">Total : {total.toFixed(2)} €</div>

      <Elements stripe={stripePromise}>
        <CheckoutForm totalAmount={total} />
      </Elements>
    </div>
  );
};

export default Checkout;
