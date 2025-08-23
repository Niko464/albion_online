import { cityNamesToIds } from '@albion_online/common';

export const getABDLocationIds = (locationNames: string[]): string[] => {
  return locationNames.map((name) => cityNamesToIds[name] || '');
};
