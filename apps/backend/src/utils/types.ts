export type ABDMarketOrder = {
  Id: number;
  ItemTypeId: string;
  ItemGroupTypeId: string;
  LocationId: number;
  QualityLevel: number;
  EnchantmentLevel: number;
  UnitPriceSilver: number;
  Amount: number;
  AuctionType: 'offer' | 'request';
  Expires: string; // ISO timestamp string
};

export const rawRessourceNames = ['HIDE', 'WOOD', 'FIBER', 'ORE', 'ROCK'];

export const refinedRessourceNames = [
  'LEATHER',
  'PLANK',
  'CLOTH',
  'METALBAR',
  'STONEBLOCK',
];

export const allRessourceIds: string[] = (() => {
  const toReturn: string[] = [];

  const allRessourceNames = [...rawRessourceNames, ...refinedRessourceNames];

  for (const ressourceName of allRessourceNames) {
    for (let i = 1; i <= 8; i++) {
      toReturn.push(`T${i}_${ressourceName}`);
    }
  }

  return toReturn;
})();
