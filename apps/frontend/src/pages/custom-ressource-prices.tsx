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
import { formatDistanceToNowStrict, differenceInMinutes } from "date-fns";
import { cityColors } from "@/utils/types";
import { BACKEND_URL } from "@/constants";
import { getAgeCategoryColor } from "@/utils/getAgeCategoryColor";
import type { GetPricesResponse } from "@albion_online/common";
import { useItemTiers } from "@/hooks/useItemTiers";

function parseAlbionDate(dateStr: string): Date {
  // Append 'Z' if not present (to treat as UTC)
  if (!dateStr.endsWith("Z")) {
    dateStr += "Z";
  }
  return new Date(dateStr);
}

export default function CustomResourcePricesPage() {
  const { resource } = useParams();
  const itemIds = useItemTiers(resource!);

  const { data, isLoading, error } = useQuery({
    queryKey: ["custom-prices", resource],
    queryFn: async () => {
      const url = `${BACKEND_URL}/prices`;
      const response = await axios.patch<GetPricesResponse>(url, {
        itemIds,
      });
      return response.data;
    },
    enabled: itemIds.length > 0,
  });

  if (error)
    return <div className="p-4 text-destructive">Error fetching prices</div>;

  const sortedIds = itemIds.sort((a, b) => {
    return a.localeCompare(b);
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
                : sortedIds.map((itemId) => {
                    console.log("Processing itemId:", itemId);
                    const itemData = data?.prices.find(
                      (el) => el.itemId === itemId
                    );

                    console.log("Item data:", itemData);
                    return (
                      <TableRow key={itemId}>
                        <TableCell>
                          <img
                            src={`https://render.albiononline.com/v1/item/${itemId}.png`}
                            alt={itemId}
                            className="w-12 h-12 object-contain"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2 py-2">
                            {itemData?.markets.map((marketData) => {
                              const color =
                                cityColors[marketData.locationName] ||
                                "#d1d5db";
                              const parsedDate =
                                marketData.orders[0].receivedAt;
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
                                <Tooltip
                                  key={`${marketData.locationName}-${itemId}`}
                                >
                                  <TooltipTrigger asChild>
                                    <span
                                      className="text-xs text-white px-3 py-1 rounded-full font-medium flex items-center gap-1 cursor-default"
                                      style={{ backgroundColor: color }}
                                    >
                                      <span>{marketData.locationName}</span>
                                      <span
                                        className={`w-2 h-2 rounded-full ${freshnessColor}`}
                                        title={`Updated ${minutesOld} mins ago`}
                                      />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-xs">
                                    <div className="font-semibold mb-1">
                                      {marketData.locationName}
                                    </div>
                                    <div>
                                      Price:{" "}
                                      {marketData.orders[0].price.toLocaleString()}{" "}
                                      Silver
                                    </div>
                                    <div>
                                      Amt: {marketData.orders[0].amount}
                                    </div>
                                    <div>Age: {ageText}</div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </TooltipProvider>
  );
}
