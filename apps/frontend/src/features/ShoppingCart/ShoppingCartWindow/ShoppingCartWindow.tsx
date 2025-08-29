import { useMemo, useRef, useState } from "react";
import {
  ShoppingCart as ShoppingCartIcon,
  Minimize2,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { CartItem, MaterialItem } from "../types";
import { renderItemImage } from "@/pages/RecipesPage/components/renderItemImage";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingAddItem } from "../ShoppingAddItem";
import type { useShoppingCart } from "../useShoppingCart";
import type { CitySelectionsType } from "@/pages/RecipesPage/RecipePage";
import type { GetPricesResponse } from "@albion_online/common";
import { MaterialRow } from "./MaterialRow";
import { getListMarketsForItemId } from "@/pages/RecipesPage/hooks/useListMarketsForItemId";

type Props = {
  cartItems: CartItem[];
  requiredMaterials: MaterialItem[];
  resetCart: () => void;
  addToCart: ReturnType<typeof useShoppingCart>["addRecipeToCart"];
  removeFromCart: ReturnType<typeof useShoppingCart>["removeRecipeFromCart"];
  itemTranslations: Record<string, string>;
  selections: CitySelectionsType;
  priceData: GetPricesResponse;
  useInstantSell: boolean;
};

export function ShoppingCartWindow({
  cartItems,
  requiredMaterials,
  resetCart,
  addToCart,
  removeFromCart,
  itemTranslations,
  selections,
  priceData,
  useInstantSell,
}: Props) {
  const [minimized, setMinimized] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const totalExpenses = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const itemTotal =
        item.amount *
        item.recipe.ingredients.reduce((sum, ingredient) => {
          const markets = getListMarketsForItemId(
            ingredient.itemId,
            priceData,
            useInstantSell
          );
          const selectedMarket = markets.find(
            (el) => el.locationName === selections[ingredient.itemId]
          );
          return (
            sum +
            (selectedMarket ? selectedMarket.price * ingredient.quantity : 0)
          );
        }, 0);
      return acc + itemTotal;
    }, 0);
  }, [cartItems, priceData, selections, useInstantSell]);

  return (
    <div
      ref={nodeRef}
      className="fixed z-50"
      style={{ top: 20, right: 20 }} // use fixed instead of absolute
    >
      <AnimatePresence initial={false}>
        {minimized ? (
          <motion.div
            key="minimized"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                duration: 0.3,
                delay: 0.3,
              },
            }}
            // exit={{
            //   scale: 0.8,
            //   opacity: 0,
            //   transition: {
            //     duration: 0.1,
            //     delay: 0,
            //   },
            // }}
            className="bg-accent shadow-lg rounded-full p-3 cursor-pointer flex items-center justify-center"
            onClick={() => setMinimized(false)}
          >
            <ShoppingCartIcon className="w-6 h-6" />
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                duration: 0.3,
                delay: 0.1,
              },
            }}
            exit={{ opacity: 0 }}
          >
            <Card className="w-100 max-h-[70vh] flex flex-col shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="flex justify-between items-center bg-accent">
                <h3 className="font-semibold flex items-center gap-2">
                  <ShoppingCartIcon className="w-5 h-5" />
                  Shopping Cart
                </h3>
                <div className="flex gap-2">
                  <Button
                    className="cursor-pointer"
                    size="icon"
                    variant="secondary"
                    onClick={resetCart}
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    className="cursor-pointer"
                    size="icon"
                    variant="secondary"
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
                    <ul className="space-y-1 flex-wrap w-full flex gap-2">
                      {cartItems.map((item) => (
                        <li
                          key={item.recipe.recipeId}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Card className="flex flex-row bg-accent justify-center items-center px-4 py-0 gap-2">
                            <span className="font-medium">x{item.amount}</span>
                            {renderItemImage(
                              item.recipe.recipeId,
                              itemTranslations[item.recipe.recipeId]
                            )}
                            <ShoppingAddItem
                              recipe={item.recipe}
                              addToCart={addToCart}
                              removeFromCart={removeFromCart}
                            />
                          </Card>
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
                        <MaterialRow
                          key={mat.itemId}
                          material={mat}
                          itemTranslations={itemTranslations}
                          priceData={priceData}
                          useInstantSell={useInstantSell}
                          currentSelection={selections[mat.itemId]}
                        />
                      ))}
                    </ul>
                  )}
                </div>
                <div className="border-t border-gray-300 my-2" />

                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span>{totalExpenses.toLocaleString()} silver</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
