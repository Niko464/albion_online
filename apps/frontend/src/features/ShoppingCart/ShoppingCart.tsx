"use client";

import { useRef, useState } from "react";
import {
  ShoppingCart as ShoppingCartIcon,
  Minimize2,
  Maximize2,
  X,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { CartItem } from "./types";
import type { MaterialItem } from "./types";

type Props = {
  cartItems: CartItem[];
  requiredMaterials: MaterialItem[];
  resetCart: () => void;
};

export function ShoppingCartWindow({
  cartItems,
  requiredMaterials,
  resetCart,
}: Props) {
  const [minimized, setMinimized] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);


  return (
    <div ref={nodeRef} className="absolute z-50" style={{ top: 0, right: 20 }}>
      {minimized ? (
        <div
          className="bg-accent shadow-lg rounded-full p-3 cursor-pointer flex items-center justify-center"
          onClick={() => setMinimized(false)}
        >
          <ShoppingCartIcon className="w-6 h-6" />
        </div>
      ) : (
        <Card className="w-80 max-h-[70vh] flex flex-col shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="flex justify-between items-center bg-accent">
            <h3 className="font-semibold flex items-center gap-2">
              <ShoppingCartIcon className="w-5 h-5" />
              Shopping Cart
            </h3>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={resetCart}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setMinimized(true)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="overflow-y-auto flex-1 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Recipes</h4>
              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-500">No items in cart</p>
              ) : (
                <ul className="space-y-1">
                  {cartItems.map((item) => (
                    <li
                      key={item.recipe.recipeId}
                      className="flex justify-between text-sm"
                    >
                      <span>{item.recipe.recipeId}</span>
                      <span className="font-medium">x{item.amount}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Materials</h4>
              {requiredMaterials.length === 0 ? (
                <p className="text-sm text-gray-500">No materials</p>
              ) : (
                <ul className="space-y-1">
                  {requiredMaterials.map((mat) => (
                    <li
                      key={mat.itemId}
                      className="flex justify-between text-sm"
                    >
                      <span>{mat.itemId}</span>
                      <span className="font-medium">x{mat.amount}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
