import type { PlayerSpecializationStats } from "@albion_online/common";
import { useCallback, useEffect, useState } from "react";

const getDefaultSpec = (branchNames: string[]): PlayerSpecializationStats => {
  const defaultSpec: PlayerSpecializationStats = {
    mastery: 0,
    specializations: {},
  };

  branchNames.forEach((branch) => {
    defaultSpec.specializations[branch] = 0;
  });

  return defaultSpec;
};

const loadFromLocalStorage = (
  category: string,
  branchNames: string[]
): PlayerSpecializationStats => {
  const key = `playerSpec:${category}`;

  const elem = localStorage.getItem(key);

  if (!elem) {
    return getDefaultSpec(branchNames);
  }

  return JSON.parse(elem);
};

export const usePlayerSpecHelper = (
  category: string,
  branchNames: string[]
) => {
  const [playerSpec, setPlayerSpec] = useState<PlayerSpecializationStats>(
    loadFromLocalStorage(category, branchNames)
  );

  const setMaxSpec = useCallback(
    (bool: boolean) => {
      if (bool) {
        setPlayerSpec({
          mastery: 100,
          specializations: branchNames.reduce((acc, branch) => {
            acc[branch] = 100;
            return acc;
          }, {} as Record<string, number>),
        });
      } else {
        setPlayerSpec(loadFromLocalStorage(category, branchNames));
      }
    },
    [category, branchNames]
  );

  const updateSpecialization = useCallback(
    (branchName: string, value: number) => {
      setPlayerSpec((prevSpec) => {
        const newSpec = { ...prevSpec };
        if (branchName === "mastery") {
          newSpec.mastery = value;
        } else {
          newSpec.specializations[branchName] = value;
        }
        localStorage.setItem(`playerSpec:${category}`, JSON.stringify(newSpec));
        return newSpec;
      });
    },
    [category]
  );

  useEffect(() => {
    setPlayerSpec(loadFromLocalStorage(category, branchNames));
  }, [category, branchNames]);

  return { playerSpec, updateSpecialization, setMaxSpec };
};
