import { useCallback, useEffect, useState } from "react";

const key = `favoriteRecipes:craftingCategory`;

export const useFavoriteRecipes = (craftingCategory: string) => {
  const [favoriteList, setFavoriteList] = useState<string[]>([]);

  const loadFromStorage = useCallback(() => {
    const elem = localStorage.getItem(`${key}:${craftingCategory}`);
    if (elem) {
      setFavoriteList(JSON.parse(elem));
    }
  }, [craftingCategory]);

  const saveToStorage = useCallback(() => {
    localStorage.setItem(
      `${key}:${craftingCategory}`,
      JSON.stringify(favoriteList)
    );
  }, [favoriteList, craftingCategory]);

  const toggleFavorite = useCallback((recipeId: string) => {
    setFavoriteList((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    saveToStorage();
  }, [favoriteList, saveToStorage]);

  return { favoriteList, toggleFavorite };
};
