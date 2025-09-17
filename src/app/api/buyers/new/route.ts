import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Enum mappings from frontend strings → Prisma enums
const bhkMap: Record<string, "One" | "Two" | "Three" | "Four" | "Studio"> = {
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "Studio": "Studio",
};

const timelineMap: Record<string, "ZERO_TO_3M" | "THREE_TO_6M" | "MORE_THAN_6M" | "Exploring"> = {
  "0-3m": "ZERO_TO_3M",
  "3-6m": "THREE_TO_6M",
  ">6m": "MORE_THAN_6M",
  "Exploring": "Exploring",
};

const purposeMap: Record<string, "Buy" | "Rent"> = {
  "Buy": "Buy",
  "Rent": "Rent",
};

const sourceMap: Record<string, "Website" | "Referral" | "WalkIn" | "Call" | "Other"> = {
  "Website": "Website",
  "Referral": "Referral",
  "Walk-in": "WalkIn",
  "Call": "Call",
  "Other": "Other",
};

const statusMap: Record<string, "New" | "Qualified" | "Contacted" | "Visited" | "Negotiation" | "Converted" | "Dropped"> = {
  "New": "New",
  "Qualified": "Qualified",
  "Contacted": "Contacted",
  "Visited": "Visited",
  "Negotiation": "Negotiation",
  "Converted": "Converted",
  "Dropped": "Dropped",
};

const cityMap: Record<string, "Chandigarh" | "Mohali" | "Zirakpur" | "Panchkula" | "Other"> = {
  "Chandigarh": "Chandigarh",
  "Mohali": "Mohali",
  "Zirakpur": "Zirakpur",
  "Panchkula": "Panchkula",
  "Other": "Other",
};

const propertyTypeMap: Record<string, "Apartment" | "Villa" | "Plot" | "Office" | "Retail"> = {
  "Apartment": "Apartment",
  "Villa": "Villa",
  "Plot": "Plot",
  "Office": "Office",
  "Retail": "Retail",
};

// Helper to get current user from cookies
async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      city,
      propertyType,
      bhk,
      purpose,
      budgetMin,
      budgetMax,
      timeline,
      source,
      notes,
      tags,
    } = body;

    // Map strings to Prisma enum values
    const mappedBhk = bhk ? bhkMap[bhk] : undefined;
    const mappedTimeline = timeline ? timelineMap[timeline] : undefined;
    const mappedPurpose = purpose ? purposeMap[purpose] : undefined;
    const mappedSource = source ? sourceMap[source] : undefined;
    const mappedCity = city ? cityMap[city] : undefined;
    const mappedPropertyType = propertyType ? propertyTypeMap[propertyType] : undefined;

    // Create buyer
    const buyer = await prisma.buyer.create({
      data: {
        fullName,
        phone,
        email,
        city: mappedCity!,
        propertyType: mappedPropertyType!,
        bhk: mappedBhk,
        purpose: mappedPurpose!,
        budgetMin,
        budgetMax,
        timeline: mappedTimeline!,
        source: mappedSource!,
        notes,
        tags: tags || [],
        ownerId: user.id,
        status: "New",
      },
    });

    // Log history
    await prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: user.id,
        diff: { action: "create", data: body },
      },
    });

    return NextResponse.json(buyer);
  } catch (err: any) {
    console.error("Error creating buyer:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
