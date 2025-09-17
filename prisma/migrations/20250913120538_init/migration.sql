/*
  Warnings:

  - You are about to drop the column `bhk` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `budgetMax` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `budgetMin` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `propertyType` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `purpose` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `timeline` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyerHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `city` on the `Buyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BuyerHistory" DROP CONSTRAINT "BuyerHistory_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BuyerHistory" DROP CONSTRAINT "BuyerHistory_changedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "public"."Buyer_city_idx";

-- DropIndex
DROP INDEX "public"."Buyer_ownerId_idx";

-- DropIndex
DROP INDEX "public"."Buyer_propertyType_idx";

-- DropIndex
DROP INDEX "public"."Buyer_status_idx";

-- DropIndex
DROP INDEX "public"."Buyer_updatedAt_idx";

-- AlterTable
ALTER TABLE "public"."Buyer" DROP COLUMN "bhk",
DROP COLUMN "budgetMax",
DROP COLUMN "budgetMin",
DROP COLUMN "email",
DROP COLUMN "notes",
DROP COLUMN "propertyType",
DROP COLUMN "purpose",
DROP COLUMN "source",
DROP COLUMN "status",
DROP COLUMN "tags",
DROP COLUMN "timeline",
ALTER COLUMN "fullName" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
DROP COLUMN "city",
ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
DROP COLUMN "emailVerified",
DROP COLUMN "image";

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."BuyerHistory";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- DropEnum
DROP TYPE "public"."BHK";

-- DropEnum
DROP TYPE "public"."City";

-- DropEnum
DROP TYPE "public"."PropertyType";

-- DropEnum
DROP TYPE "public"."Purpose";

-- DropEnum
DROP TYPE "public"."Source";

-- DropEnum
DROP TYPE "public"."Status";

-- DropEnum
DROP TYPE "public"."Timeline";
