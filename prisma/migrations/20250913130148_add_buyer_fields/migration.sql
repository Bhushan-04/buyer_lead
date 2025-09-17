/*
  Warnings:

  - The `bhk` column on the `Buyer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Buyer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `propertyType` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `purpose` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `source` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `city` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Buyer" DROP COLUMN "bhk",
ADD COLUMN     "bhk" TEXT,
DROP COLUMN "propertyType",
ADD COLUMN     "propertyType" TEXT NOT NULL,
DROP COLUMN "purpose",
ADD COLUMN     "purpose" TEXT NOT NULL,
DROP COLUMN "source",
ADD COLUMN     "source" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'New',
DROP COLUMN "city",
ADD COLUMN     "city" TEXT NOT NULL;
