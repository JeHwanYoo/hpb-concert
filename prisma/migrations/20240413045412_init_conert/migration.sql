-- CreateTable
CREATE TABLE "Concert" (
    "id" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openingAt" TIMESTAMP(3) NOT NULL,
    "closingAt" TIMESTAMP(3) NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concert_pkey" PRIMARY KEY ("id")
);
