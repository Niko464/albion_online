import { useMemo } from "react";
import itemTranslationsJSON from "./translations.json";

export const useItemTranslations = (ids: string[]) => {
  const itemTranslations = useMemo(() => {
    return ids.reduce((acc, id) => {
      const foundItem = itemTranslationsJSON.find(
        (item) => item.UniqueName === id
      );
      if (foundItem) {
        acc[id] = foundItem.LocalizedName;
      } else {
        acc[id] = id;
      }
      return acc;
    }, {} as Record<string, string>);
  }, [ids]);
  return itemTranslations;
};
