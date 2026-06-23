/*
  Warnings:

  - The values [CERTIFICATE] on the enum `DocType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[cacNumber]` on the table `VerificationRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocType_new" AS ENUM ('GOVT_ID', 'BUSINESS_CARD', 'CAC_CERTIFICATE');
ALTER TABLE "VerificationDocument" ALTER COLUMN "type" TYPE "DocType_new" USING ("type"::text::"DocType_new");
ALTER TYPE "DocType" RENAME TO "DocType_old";
ALTER TYPE "DocType_new" RENAME TO "DocType";
DROP TYPE "public"."DocType_old";
COMMIT;

-- AlterTable
ALTER TABLE "VerificationRequest" ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "cacNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_cacNumber_key" ON "VerificationRequest"("cacNumber");
