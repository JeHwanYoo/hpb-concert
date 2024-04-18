/*
  Warnings:

  - You are about to drop the column `price` on the `Seat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Concert" ALTER COLUMN "price" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "price";
