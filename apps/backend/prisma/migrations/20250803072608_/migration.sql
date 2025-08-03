/*
  Warnings:

  - Added the required column `marketOrderId` to the `MarketOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MarketOrder" ADD COLUMN     "marketOrderId" TEXT NOT NULL;
