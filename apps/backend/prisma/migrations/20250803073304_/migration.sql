/*
  Warnings:

  - You are about to drop the column `price` on the `MarketOrder` table. All the data in the column will be lost.
  - Added the required column `amount` to the `MarketOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `MarketOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `MarketOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MarketOrder" DROP COLUMN "price",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" INTEGER NOT NULL,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;
