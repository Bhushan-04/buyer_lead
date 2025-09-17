-- CreateEnum
CREATE TYPE "public"."City" AS ENUM ('CHANDIGARH', 'MOHALI', 'ZIRAKPUR', 'PANCHKULA', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('APARTMENT', 'VILLA', 'PLOT', 'OFFICE', 'RETAIL');

-- CreateEnum
CREATE TYPE "public"."BHK" AS ENUM ('1', '2', '3', '4', 'STUDIO');

-- CreateEnum
CREATE TYPE "public"."Purpose" AS ENUM ('BUY', 'RENT');

-- CreateEnum
CREATE TYPE "public"."Timeline" AS ENUM ('0-3m', '3-6m', '>6m', 'EXPLORING');

-- CreateEnum
CREATE TYPE "public"."Source" AS ENUM ('WEBSITE', 'REFERRAL', 'Walk-in', 'CALL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('NEW', 'QUALIFIED', 'CONTACTED', 'VISITED', 'NEGOTIATION', 'CONVERTED', 'DROPPED');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Buyer" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(80) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(15) NOT NULL,
    "city" "public"."City" NOT NULL,
    "propertyType" "public"."PropertyType" NOT NULL,
    "bhk" "public"."BHK",
    "purpose" "public"."Purpose" NOT NULL,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "timeline" "public"."Timeline" NOT NULL,
    "source" "public"."Source" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BuyerHistory" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diff" JSONB NOT NULL,

    CONSTRAINT "BuyerHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Buyer_ownerId_idx" ON "public"."Buyer"("ownerId");

-- CreateIndex
CREATE INDEX "Buyer_status_idx" ON "public"."Buyer"("status");

-- CreateIndex
CREATE INDEX "Buyer_city_idx" ON "public"."Buyer"("city");

-- CreateIndex
CREATE INDEX "Buyer_propertyType_idx" ON "public"."Buyer"("propertyType");

-- CreateIndex
CREATE INDEX "Buyer_updatedAt_idx" ON "public"."Buyer"("updatedAt");

-- CreateIndex
CREATE INDEX "BuyerHistory_buyerId_idx" ON "public"."BuyerHistory"("buyerId");

-- CreateIndex
CREATE INDEX "BuyerHistory_changedAt_idx" ON "public"."BuyerHistory"("changedAt");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Buyer" ADD CONSTRAINT "Buyer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BuyerHistory" ADD CONSTRAINT "BuyerHistory_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."Buyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BuyerHistory" ADD CONSTRAINT "BuyerHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
