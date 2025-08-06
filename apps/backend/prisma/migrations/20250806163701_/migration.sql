-- CreateTable
CREATE TABLE "public"."OcrPrice" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OcrPrice_pkey" PRIMARY KEY ("id")
);
