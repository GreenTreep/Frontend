import { createContext, useContext, useEffect, useState } from "react";
import api from "@/security/auth/Api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const res = await api.get("/cart");
    setCartItems(res.data);
  };

  const addToCart = async (productId) => {
    await api.post(`/cart/${productId}`);
    fetchCart();
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };


  const clearCart = async () => {
    try {
      await api.delete("/cart/clear"); // ⚠️ Ton endpoint backend doit supporter ça
      setCartItems([]); // 🔁 vide aussi localement
    } catch (err) {
      console.error("❌ Erreur lors de la suppression du panier :", err);
    }
  };
  

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, fetchCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
