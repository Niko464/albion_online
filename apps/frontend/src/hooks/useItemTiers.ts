import { useMemo } from "react";

export const useItemTiers = (itemName: string) => {
  const itemTiers = useMemo(() => {
    const result: string[] = [];
    for (let i = 1; i <= 8; i++) {
      const itemId = `T${i}_${itemName}`;
      result.push(itemId);
    }
    return result;
  }, [itemName]);

  return itemTiers;
};
