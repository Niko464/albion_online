-- AlterTable
ALTER TABLE "public"."MarketOrder"
RENAME COLUMN "totalPrice" TO "price";
ALTER TABLE "public"."MarketOrder"
DROP COLUMN "unitPrice";