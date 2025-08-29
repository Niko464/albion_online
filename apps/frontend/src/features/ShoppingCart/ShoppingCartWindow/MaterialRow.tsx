import { renderItemImage } from "@/pages/RecipesPage/components/renderItemImage";
import type { MaterialItem } from "../types";
import { useListMarketsForItemId } from "@/pages/RecipesPage/hooks/useListMarketsForItemId";
import type { GetPricesResponse } from "@albion_online/common";
import { useMemo } from "react";

type Props = {
  material: MaterialItem;
  itemTranslations: Record<string, string>;
  priceData: GetPricesResponse;
  useInstantSell: boolean;
  currentSelection: string | null;
};

export function MaterialRow({
  material,
  itemTranslations,
  priceData,
  useInstantSell,
  currentSelection,
}: Props) {
  const markets = useListMarketsForItemId(
    material.itemId,
    priceData,
    useInstantSell
  );

  const selectedMarket = useMemo(() => {
    return (
      markets.find((market) => market.locationName === currentSelection) || null
    );
  }, [markets, currentSelection]);

  return (
    <li className="flex items-center gap-2 text-sm">
      <span className="font-medium">x{material.amount}</span>
      {renderItemImage(material.itemId, itemTranslations[material.itemId])}
      {selectedMarket ? (
        <span>
          {Math.round(selectedMarket?.price * material.amount).toLocaleString()}{" "}
          ({selectedMarket?.minutesAgo} mins ago)
        </span>
      ) : (
        <span>No market data available</span>
      )}
    </li>
  );
}
