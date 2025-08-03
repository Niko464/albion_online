import albion_world from './albion_world.json';

export const getLocationName = (locationId: string): string => {
  const found = albion_world.find((el) => el.Index === locationId);

  if (!found) {
    throw new Error(`Location with ID ${locationId} not found`);
  }

  return found.UniqueName;
};
