-- CreateEnum
CREATE TYPE "ImageAngle" AS ENUM ('FRONT', 'REAR', 'LEFT', 'RIGHT', 'INTERIOR', 'UNDERNEATH', 'OPTIONAL');

-- AlterTable
ALTER TABLE "CarImage" ADD COLUMN     "angle" "ImageAngle" NOT NULL DEFAULT 'OPTIONAL';
