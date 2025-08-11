import { BACKEND_URL } from "@/constants";
import type { GetPricesDto, GetPricesResponse } from "@albion_online/common";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCustomPrices = (itemIds: string[], cities: string[]) => {
  const query = useQuery({
    queryKey: ["custom-prices", itemIds, cities],
    queryFn: async () => {
      const url = `${BACKEND_URL}/prices`;
      const response = await axios.patch<GetPricesResponse>(url, {
        itemIds,
        cities,
      } satisfies GetPricesDto);
      return response.data;
    },
    enabled: itemIds.length > 0,
  });

  return query;
};
