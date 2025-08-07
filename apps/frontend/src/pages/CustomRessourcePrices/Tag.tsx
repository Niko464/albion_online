import { Button } from "@/components/ui/button";
import { getAgeCategoryColor } from "@/utils/getAgeCategoryColor";
import { cityColors, type GetPricesResponse } from "@albion_online/common";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { differenceInMinutes, formatDistanceToNowStrict } from "date-fns";

type Props = {
  marketData: GetPricesResponse["prices"][number]["markets"][number];
  itemId: string;
  onClick: () => void;
};

export function Tag({ marketData, onClick }: Props) {
  const color = cityColors[marketData.locationName] || "#d1d5db";
  const parsedDate = marketData.offerOrders[0].receivedAt;
  const minutesOld = differenceInMinutes(new Date(), parsedDate);
  const freshnessColor = getAgeCategoryColor(minutesOld);
  const ageText = formatDistanceToNowStrict(parsedDate, {
    addSuffix: true,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="text-xs  px-3 py-1 rounded-sm font-medium flex items-center gap-1 cursor-default flex-col"
          style={{ backgroundColor: color }}
          onClick={onClick}
        >
          <div className="flex items-center gap-1">
            <span
              className={`flex min-w-2 min-h-2 rounded-full ${freshnessColor}`}
              title={`Updated ${minutesOld} mins ago`}
            />{" "}
            <span>
              {marketData.offerOrders[0].price.toLocaleString()} silver/unit
            </span>
          </div>
          <span>{minutesOld} mins ago</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-xs bg-white text-gray-800 p-2 rounded shadow-md">
        <div className="font-semibold mb-1">{marketData.locationName}</div>
        <div>
          Price: {marketData.offerOrders[0].price.toLocaleString()} Silver
        </div>
        <div>Amt: {marketData.offerOrders[0].amount}</div>
        <div>Age: {ageText}</div>
        <div>(click to view details)</div>
      </TooltipContent>
    </Tooltip>
  );
}
