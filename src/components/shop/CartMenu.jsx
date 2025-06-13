import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

export default function CartMenu() {
  const { cartItems, removeFromCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleConfirm = (productId) => {
    setSelectedProductId(productId);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (selectedProductId) {
      await removeFromCart(selectedProductId);
      setConfirmOpen(false);
      setSelectedProductId(null);
    }
  };

  return (
    <>
      <DropdownMenuContent className="p-4 w-80 space-y-3">
        <h3 className="text-lg font-bold">🛒 Mon panier</h3>
        {cartItems.length === 0 ? (
          <p className="text-sm">Panier vide</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm items-center"
              >
                <div>
                  {item.product.name} × {item.quantity}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleConfirm(item.product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="pt-2 border-t text-right text-sm font-bold">
              Total : {total.toFixed(2)} €
            </div>
            <Button className="w-full mt-2" onClick={() => navigate("/checkout")}>
              Passer au paiement
            </Button>
          </>
        )}
      </DropdownMenuContent>

      {/* ✅ Boîte de confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'article ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Es-tu sûr(e) de vouloir retirer cet article du panier ?
          </p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleDelete}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
