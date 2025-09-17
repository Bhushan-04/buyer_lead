/*
  Warnings:

  - The values [One,Two,Three,Four] on the enum `BHK` will be removed. If these variants are still used in the database, this will fail.
  - The values [WalkIn] on the enum `Source` will be removed. If these variants are still used in the database, this will fail.
  - The `bhk` column on the `Buyer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Buyer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `timeline` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `propertyType` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `purpose` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `source` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `city` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Timeline" AS ENUM ('0-3m', '3-6m', '>6m', 'Exploring');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."BHK_new" AS ENUM ('1', '2', '3', '4', 'Studio');
ALTER TABLE "public"."Buyer" ALTER COLUMN "bhk" TYPE "public"."BHK_new" USING ("bhk"::text::"public"."BHK_new");
ALTER TYPE "public"."BHK" RENAME TO "BHK_old";
ALTER TYPE "public"."BHK_new" RENAME TO "BHK";
DROP TYPE "public"."BHK_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Source_new" AS ENUM ('Website', 'Referral', 'Walk-in', 'Call', 'Other');
ALTER TABLE "public"."Buyer" ALTER COLUMN "source" TYPE "public"."Source_new" USING ("source"::text::"public"."Source_new");
ALTER TYPE "public"."Source" RENAME TO "Source_old";
ALTER TYPE "public"."Source_new" RENAME TO "Source";
DROP TYPE "public"."Source_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Buyer" ADD COLUMN     "timeline" "public"."Timeline" NOT NULL,
ALTER COLUMN "fullName" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "bhk",
ADD COLUMN     "bhk" "public"."BHK",
DROP COLUMN "propertyType",
ADD COLUMN     "propertyType" "public"."PropertyType" NOT NULL,
DROP COLUMN "purpose",
ADD COLUMN     "purpose" "public"."Purpose" NOT NULL,
DROP COLUMN "source",
ADD COLUMN     "source" "public"."Source" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'New',
DROP COLUMN "city",
ADD COLUMN     "city" "public"."City" NOT NULL;
