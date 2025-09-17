/*
  Warnings:

  - You are about to alter the column `fullName` on the `Buyer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(80)`.
  - You are about to alter the column `phone` on the `Buyer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - Added the required column `propertyType` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `city` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."City" AS ENUM ('Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('Apartment', 'Villa', 'Plot', 'Office', 'Retail');

-- CreateEnum
CREATE TYPE "public"."BHK" AS ENUM ('Studio', 'One', 'Two', 'Three', 'Four');

-- CreateEnum
CREATE TYPE "public"."Purpose" AS ENUM ('Buy', 'Rent');

-- CreateEnum
CREATE TYPE "public"."Source" AS ENUM ('Website', 'Referral', 'WalkIn', 'Call', 'Other');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped');

-- AlterTable
ALTER TABLE "public"."Buyer" ADD COLUMN     "bhk" "public"."BHK",
ADD COLUMN     "budgetMax" INTEGER,
ADD COLUMN     "budgetMin" INTEGER,
ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "notes" VARCHAR(1000),
ADD COLUMN     "propertyType" "public"."PropertyType" NOT NULL,
ADD COLUMN     "purpose" "public"."Purpose" NOT NULL,
ADD COLUMN     "source" "public"."Source" NOT NULL,
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'New',
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "fullName" SET DATA TYPE VARCHAR(80),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(15),
DROP COLUMN "city",
ADD COLUMN     "city" "public"."City" NOT NULL;
