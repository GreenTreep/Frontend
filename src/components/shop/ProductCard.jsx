import { useState } from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const shortDescription = product.description
    .split(" ")
    .slice(0, 3)
    .join(" ") + " ...";

  const [open, setOpen] = useState(false);
  const { addToCart } = useCart();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Card
        onClick={() => setOpen(true)}
        className="w-full flex flex-col p-2 shadow-sm cursor-pointer hover:shadow-md transition h-64 justify-between"
        >
        <div className="flex flex-col items-center">
            <img
            src={`/product/${product.imageUrl}`}
            alt={product.name}
            className="w-24 h-24 object-contain mb-2"
            />
            <CardTitle className="text-base text-center min-h-[2.5rem]">
            {product.name}
            </CardTitle>
            <CardDescription className="text-sm text-center min-h-[1rem]">
            {shortDescription}
            </CardDescription>
        </div>

        <CardContent className="flex flex-col items-center gap-1 mt-auto">
            <p className="text-sm font-bold">{product.price} €</p>
        </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center mt-4">
          <img
            src={`/product/${product.imageUrl}`}
            alt={product.name}
            className="w-40 h-40 object-contain mb-4"
          />
          <p className="text-lg font-semibold mb-2">{product.price} €</p>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              addToCart(product.id);
              setOpen(false);
            }}
            disabled={product.stock <= 0}
            className="w-full"
          >
            Ajouter au panier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
