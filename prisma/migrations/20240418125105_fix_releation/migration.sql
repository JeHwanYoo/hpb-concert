-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_seatId_fkey";

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
