import { renderItemImage } from "@/pages/CookingRecipesPage/components/renderItemImage";
import { Tag } from "@/pages/CustomRessourcePrices/Tag";
import type { PriceComparisonRowData } from "@/utils/types";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

const columnHelper = createColumnHelper<PriceComparisonRowData>();

export const usePriceComparisonColumns = (
  itemTranslations: Record<string, string>
): ColumnDef<PriceComparisonRowData, any>[] => {
  return [
    columnHelper.accessor("itemId", {
      id: "itemId",
      header: "ItemId",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            {renderItemImage(
              row.original.itemId,
              itemTranslations[row.original.itemId]
            )}
          </div>
        );
      },
      size: 110,
    }),
    columnHelper.display({
      id: "price",
      header: "Price",
      cell: ({ row }) => {
        const itemId = row.original.itemId;
        if (!row.original.priceData) return null;
        return (
          <div className="flex flex-row gap-4">
            {row.original.priceData?.markets.map((marketData) => {
              if (marketData.offerOrders.length === 0) {
                return null;
              }
              return (
                <Tag
                  key={`${marketData.locationName}-${itemId}`}
                  itemId={itemId}
                  marketData={marketData}
                  onClick={() => {
                    // setSelectedMarketData(marketData);
                  }}
                />
              );
            })}
          </div>
        );
      },
      size: 110,
    }),
  ];
};
