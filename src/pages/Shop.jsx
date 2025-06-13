import { useEffect, useState } from "react";
import api from "@/security/auth/Api";
import ProductCard from "../components/shop/ProductCard";
import Cart from "../components/shop/Cart";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty < product.stock) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          );
        } else {
          return prev;
        }
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-[5cm] py-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
    </div>
    </div>
  );
}
