import { BACKEND_URL } from "@/constants";
import type { GetPricesDto, GetSoldHistoryResponse } from "@albion_online/common";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useQuantitySoldHistory = (itemIds: string[], cities: string[]) => {
  const query = useQuery({
    queryKey: ["quantity-sold-history", itemIds, cities],
    queryFn: async () => {
      const url = `${BACKEND_URL}/sold-history`;
      const response = await axios.patch<GetSoldHistoryResponse>(url, {
        itemIds,
        cities,
      } satisfies GetPricesDto);
      return response.data;
    },
    enabled: itemIds.length > 0,
  });

  return query;
};
