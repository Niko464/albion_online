export function getAgeCategoryColor(minutesOld: number): string {
  if (minutesOld < 30) return "bg-green-500";
  if (minutesOld < 60) return "bg-yellow-400";
  if (minutesOld < 90) return "bg-orange-500";
  return "bg-red-500";
}