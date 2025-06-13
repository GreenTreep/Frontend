import { useEffect, useState } from "react";
import api from "@/security/auth/Api";

export default function Orders() {
  const [ordersByDate, setOrdersByDate] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");

        // Regroupement par date (AAAA-MM-JJ)
        const grouped = {};
        res.data.forEach((order) => {
          const date = new Date(order.orderDate)
            .toISOString()
            .split("T")[0]; // ex: "2025-06-13"
          if (!grouped[date]) {
            grouped[date] = [];
          }
          grouped[date].push(order);
        });

        setOrdersByDate(grouped);
      } catch (err) {
        console.error("❌ Impossible de récupérer les commandes :", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6">Mes commandes</h2>

      {Object.keys(ordersByDate).length === 0 ? (
        <p className="text-gray-600">Vous n'avez passé aucune commande.</p>
      ) : (
        Object.entries(ordersByDate).map(([date, orders]) => (
          <div key={date} className="mb-8">
            <h3 className="text-xl font-semibold text-green-500 mb-3">
              Commandes du {new Date(date).toLocaleDateString("fr-FR")}
            </h3>
            <table className="w-full border-collapse">
            <thead>
            <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b w-2/5">Produit</th>
                <th className="p-3 border-b w-1/5">Quantité</th>
                <th className="p-3 border-b w-1/5">Prix unitaire</th>
                <th className="p-3 border-b w-1/5">Total</th>
                <th className="p-3 border-b w-1/5">Heure</th>
            </tr>
            </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b w-2/5">{order.product.name}</td>
                    <td className="p-3 border-b w-1/5">{order.quantity}</td>
                    <td className="p-3 border-b w-1/5">
                      {order.product.price.toFixed(2)} €
                    </td>
                    <td className="p-3 border-b w-1/5">
                      {(order.quantity * order.product.price).toFixed(2)} €
                    </td>
                    <td className="p-3 border-bw-1/5">
                      {new Date(order.orderDate).toLocaleTimeString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
