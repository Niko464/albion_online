import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  formatDistanceToNowStrict,
  parseISO,
  differenceInMinutes,
} from "date-fns";
import { allCities, cityColors } from "@/utils/types";
import { ENDPOINT } from "@/constants";

// 🧠 Get age freshness color
function getAgeCategoryColor(minutesOld: number): string {
  if (minutesOld < 30) return "bg-green-500";
  if (minutesOld < 60) return "bg-yellow-400";
  if (minutesOld < 90) return "bg-orange-500";
  return "bg-red-500";
}

const itemIdMap: Record<string, string[]> = {
  hide: [
    "T1_HIDE",
    "T2_HIDE",
    "T3_HIDE",
    "T4_HIDE",
    "T5_HIDE",
    "T6_HIDE",
    "T7_HIDE",
    "T8_HIDE",
  ],
  leather: [
    "T2_LEATHER",
    "T3_LEATHER",
    "T4_LEATHER",
    "T5_LEATHER",
    "T6_LEATHER",
    "T7_LEATHER",
    "T8_LEATHER",
  ],
};

function parseAlbionDate(dateStr: string): Date {
  // Append 'Z' if not present (to treat as UTC)
  if (!dateStr.endsWith("Z")) {
    dateStr += "Z";
  }
  return new Date(dateStr);
}

export default function ResourcePricesPage() {
  const { resource } = useParams();
  const itemIds = itemIdMap[resource || ""] ?? [];

  const { data, isLoading, error } = useQuery({
    queryKey: ["prices", resource],
    queryFn: async () => {
      const itemParam = itemIds.join(",");
      const cityParam = allCities.join(",");
      const url = `${ENDPOINT}/api/v2/stats/prices/${itemParam}?locations=${cityParam}&qualities=1`;
      const response = await axios.get(url);
      return response.data;
    },
    enabled: itemIds.length > 0,
  });

  if (error)
    return <div className="p-4 text-destructive">Error fetching prices</div>;

  const groupedByTier = itemIds.map((tierId) => {
    const entries = data?.filter(
      (d: any) => d.item_id === tierId && d.sell_price_min > 0
    );
    const sorted = [...(entries || [])].sort(
      (a, b) => a.sell_price_min - b.sell_price_min
    );
    return { tierId, data: sorted };
  });

  return (
    <TooltipProvider>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {resource} Prices
        </h1>
        <Card className="overflow-x-auto rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead className="pl-4">Prices by City</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="w-12 h-12 rounded-md" />
                      </TableCell>
                      <TableCell className="flex gap-2 flex-wrap py-4">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Skeleton key={j} className="w-12 h-6 rounded-full" />
                        ))}
                      </TableCell>
                    </TableRow>
                  ))
                : groupedByTier.map(({ tierId, data }) => (
                    <TableRow key={tierId}>
                      <TableCell>
                        <img
                          src={`https://render.albiononline.com/v1/item/${tierId}.png`}
                          alt={tierId}
                          className="w-12 h-12 object-contain"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2 py-2">
                          {data.map((entry) => {
                            const color = cityColors[entry.city] || "#d1d5db";
                            const parsedDate = parseAlbionDate(
                              entry.sell_price_min_date
                            );

                            const minutesOld = differenceInMinutes(
                              new Date(),
                              parsedDate
                            );
                            const freshnessColor =
                              getAgeCategoryColor(minutesOld);
                            const ageText = formatDistanceToNowStrict(
                              parsedDate,
                              {
                                addSuffix: true,
                              }
                            );

                            return (
                              <Tooltip key={`${entry.city}-${entry.item_id}`}>
                                <TooltipTrigger asChild>
                                  <span
                                    className="text-xs text-white px-3 py-1 rounded-full font-medium flex items-center gap-1 cursor-default"
                                    style={{ backgroundColor: color }}
                                  >
                                    <span>{entry.city}</span>
                                    <span
                                      className={`w-2 h-2 rounded-full ${freshnessColor}`}
                                      title={`Updated ${minutesOld} mins ago`}
                                    />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">
                                  <div className="font-semibold mb-1">
                                    {entry.city}
                                  </div>
                                  <div>
                                    Price:{" "}
                                    {entry.sell_price_min.toLocaleString()}{" "}
                                    Silver
                                  </div>
                                  <div>
                                    Volume: {entry.sell_price_min_volume}
                                  </div>
                                  <div>Age: {ageText}</div>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  );
}
