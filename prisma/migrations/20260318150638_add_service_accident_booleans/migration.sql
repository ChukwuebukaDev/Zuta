/*
  Warnings:

  - You are about to drop the column `description` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the `SavedCar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Car` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bodyType` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condition` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drivetrain` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerName` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerPhone` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Made the column `mileage` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fuelType` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transmission` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "SavedCar" DROP CONSTRAINT "SavedCar_carId_fkey";

-- DropForeignKey
ALTER TABLE "SavedCar" DROP CONSTRAINT "SavedCar_userId_fkey";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "description",
DROP COLUMN "ownerId",
ADD COLUMN     "accidentHistory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bodyType" TEXT NOT NULL,
ADD COLUMN     "condition" TEXT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'NGA',
ADD COLUMN     "drivetrain" TEXT NOT NULL,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "negotiable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellerEmail" TEXT,
ADD COLUMN     "sellerName" TEXT NOT NULL,
ADD COLUMN     "sellerPhone" TEXT NOT NULL,
ADD COLUMN     "serviceHistory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'available',
ADD COLUMN     "thumbnail" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "mileage" SET NOT NULL,
ALTER COLUMN "fuelType" SET NOT NULL,
ALTER COLUMN "transmission" SET NOT NULL;

-- DropTable
DROP TABLE "SavedCar";

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "Car_slug_key" ON "Car"("slug");
