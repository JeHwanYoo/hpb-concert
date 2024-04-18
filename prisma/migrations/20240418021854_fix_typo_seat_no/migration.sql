/*
  Warnings:

  - You are about to drop the column `setNo` on the `Seat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seatNo]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seatNo` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Seat_setNo_key";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "setNo",
ADD COLUMN     "seatNo" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seat_seatNo_key" ON "Seat"("seatNo");
