import { useMemo } from "react";



export const getItemTiers = (itemName: string) => {
  const result: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const baseItemId = `T${i}_${itemName}`;

    result.push(baseItemId);
    if (i >= 4) {
      for (let enchantment = 1; enchantment <= 3; enchantment++) {
        result.push(`${baseItemId}_LEVEL${enchantment}@${enchantment}`);
      }
    }
  }
  return result;
};

export const useItemTiers = (itemName: string) => {
  const itemTiers = useMemo(() => getItemTiers(itemName), [itemName]);

  return itemTiers;
};
