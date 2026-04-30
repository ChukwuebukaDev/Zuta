/*
  Warnings:

  - You are about to alter the column `sellerPhone` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - The `status` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `fuelType` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transmission` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `condition` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('MANUAL', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NEW', 'USED', 'CERTIFIED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'SOLD');

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "color" TEXT,
DROP COLUMN "fuelType",
ADD COLUMN     "fuelType" "FuelType" NOT NULL,
DROP COLUMN "transmission",
ADD COLUMN     "transmission" "Transmission" NOT NULL,
DROP COLUMN "condition",
ADD COLUMN     "condition" "Condition" NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'NGN',
ALTER COLUMN "sellerPhone" SET DATA TYPE VARCHAR(20),
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "CarImage" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE INDEX "Car_price_idx" ON "Car"("price");

-- CreateIndex
CREATE INDEX "Car_location_idx" ON "Car"("location");

-- CreateIndex
CREATE INDEX "Car_createdAt_idx" ON "Car"("createdAt");

-- CreateIndex
CREATE INDEX "Car_status_idx" ON "Car"("status");
