/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `coins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coins" ADD COLUMN     "country" TEXT,
ADD COLUMN     "denomination" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT;

-- DropTable
DROP TABLE "users";
