export default function Cart({ cartItems, onCheckout }) {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  
    return (
      <div className="cart">
        <h2>Panier</h2>
        {cartItems.map((item) => (
          <div key={item.id}>
            {item.name} * {item.qty} — {item.price * item.qty} €
          </div>
        ))}
        <p>Total : {total.toFixed(2)} €</p>
        <button onClick={onCheckout} disabled={cartItems.length === 0}>
          Payer
        </button>
      </div>
    );
  }
  