/*
  Warnings:

  - A unique constraint covering the columns `[setNo]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setNo` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "price" BIGINT NOT NULL,
ADD COLUMN     "reservedAt" TIMESTAMP(3),
ADD COLUMN     "setNo" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seat_setNo_key" ON "Seat"("setNo");
