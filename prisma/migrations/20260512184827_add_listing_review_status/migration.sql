-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SOLD');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "listingStatus" "ListingStatus" NOT NULL DEFAULT 'PENDING';
