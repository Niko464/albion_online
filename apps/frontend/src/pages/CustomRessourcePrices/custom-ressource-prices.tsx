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
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { BACKEND_URL } from "@/constants";
import type { GetPricesResponse } from "@albion_online/common";
import { useItemTiers } from "@/hooks/useItemTiers";
import { Tag } from "./Tag";
import { useState } from "react";

export default function CustomResourcePricesPage() {
  const { resource } = useParams();
  const itemIds = useItemTiers(resource!);
  const [selectedMarketData, setSelectedMarketData] = useState<
    GetPricesResponse["prices"][number]["markets"][number] | null
  >(null);

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

  // Calculate minutes ago for the most recent order
  const getMinutesAgo = () => {
    if (!selectedMarketData) return null;
    const allOrders = [
      ...(selectedMarketData.offerOrders || []),
      ...(selectedMarketData.requestOrders || []),
    ];
    if (allOrders.length === 0) return null;
    const mostRecentOrder = allOrders.reduce((latest, order) => {
      const orderDate = new Date(order.receivedAt);
      return !latest || orderDate > new Date(latest.receivedAt)
        ? order
        : latest;
    }, allOrders[0]);
    const minutesAgo = Math.floor(
      (Date.now() - new Date(mostRecentOrder.receivedAt).getTime()) / 1000 / 60
    );
    return minutesAgo;
  };

  return (
    <TooltipProvider>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {resource} Prices
        </h1>
        <div className="flex flex-row gap-8">
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
                            <Skeleton
                              key={j}
                              className="w-12 h-6 rounded-full"
                            />
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
                          <TableCell className="w-24">
                            <img
                              src={`https://render.albiononline.com/v1/item/${itemId}.png`}
                              alt={itemId}
                              className="w-24 h-24 object-contain"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2 py-2">
                              {itemData?.markets.map((marketData) => {
                                if (marketData.offerOrders.length === 0) {
                                  return null;
                                }
                                return (
                                  <Tag
                                    key={`${marketData.locationName}-${itemId}`}
                                    itemId={itemId}
                                    marketData={marketData}
                                    onClick={() => {
                                      setSelectedMarketData(marketData);
                                    }}
                                  />
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
          <div>
            {selectedMarketData && (
              <Card className="p-4 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedMarketData.locationName} Market Details
                  {getMinutesAgo() !== null && (
                    <span className="text-sm text-muted-foreground ml-2">
                      (Last updated {getMinutesAgo()} minutes ago)
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Offer Orders ({selectedMarketData.offerOrders.length} orders)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Price</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMarketData.offerOrders.length > 0 ? (
                          selectedMarketData.offerOrders.map((order, index) => (
                            <TableRow key={index}>
                              <TableCell>{order.price}</TableCell>
                              <TableCell>{order.amount}</TableCell>
                              <TableCell>
                                {new Date(order.receivedAt).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No offer orders available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Request Orders ({selectedMarketData.requestOrders.length} orders)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Price</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMarketData.requestOrders.length > 0 ? (
                          selectedMarketData.requestOrders.map(
                            (order, index) => (
                              <TableRow key={index}>
                                <TableCell>{order.price}</TableCell>
                                <TableCell>{order.amount}</TableCell>
                                <TableCell>
                                  {new Date(order.receivedAt).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            )
                          )
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No request orders available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
