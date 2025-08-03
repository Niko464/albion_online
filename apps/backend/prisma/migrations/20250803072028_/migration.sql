-- CreateTable
CREATE TABLE "public"."MarketOrder" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "quality" INTEGER NOT NULL,
    "enchantmentLevel" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketOrder_pkey" PRIMARY KEY ("id")
);
