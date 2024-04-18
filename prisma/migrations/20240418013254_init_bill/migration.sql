-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "holderId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Concert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
