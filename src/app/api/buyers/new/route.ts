// app/api/buyers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBuyerSchema } from "@/lib/validators";

// POST /api/buyers
export async function POST(req: Request) {
  try {
    // TEMP: fixed test user ID for local dev
    const testUserId = "test-user-1";
    let user = await prisma.user.findUnique({ where: { id: testUserId } });

    // If test user doesn't exist, create it automatically
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: testUserId,
          email: "test@example.com",
          name: "Test User",
        },
      });
    }

    const body = await req.json();
    const parsed = createBuyerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    const created = await prisma.buyer.create({
      data: {
        ...mapToPrismaFields(data),
        ownerId: user.id,
      },
    });

    // Record buyer history
    await prisma.buyerHistory.create({
      data: {
        buyerId: created.id,
        changedBy: user.id,
        diff: { created: data },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// Map form/Zod data to Prisma enums
function mapToPrismaFields(data: {
  fullName: string;
  email?: string | null;
  phone: string;
  city: "Chandigarh" | "Mohali" | "Zirakpur" | "Panchkula" | "Other";
  propertyType: "Apartment" | "Villa" | "Plot" | "Office" | "Retail";
  bhk?: "1" | "2" | "3" | "4" | "Studio" | null;
  purpose: "Buy" | "Rent";
  timeline: "0-3m" | "3-6m" | ">6m" | "Exploring";
  source: "Website" | "Referral" | "Walk-in" | "Call" | "Other";
  budgetMin?: number | null;
  budgetMax?: number | null;
  notes?: string | null;
  tags?: string[] | null;
  status?: "New" | "Qualified" | "Contacted" | "Visited" | "Negotiation" | "Converted" | "Dropped";
}) {
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

  const sourceMap: Record<string, "Website" | "Referral" | "WalkIn" | "Call" | "Other"> = {
    Website: "Website",
    Referral: "Referral",
    "Walk-in": "WalkIn",
    Call: "Call",
    Other: "Other",
  };

  const statusMap: Record<string, "New" | "Qualified" | "Contacted" | "Visited" | "Negotiation" | "Converted" | "Dropped"> = {
    New: "New",
    Qualified: "Qualified",
    Contacted: "Contacted",
    Visited: "Visited",
    Negotiation: "Negotiation",
    Converted: "Converted",
    Dropped: "Dropped",
  };

  return {
    fullName: data.fullName,
    email: data.email ?? null,
    phone: data.phone,
    city: data.city,
    propertyType: data.propertyType,
    bhk: data.bhk ? bhkMap[data.bhk] : null,
    purpose: data.purpose,
    timeline: timelineMap[data.timeline],
    source: sourceMap[data.source],
    budgetMin: data.budgetMin ?? null,
    budgetMax: data.budgetMax ?? null,
    notes: data.notes ?? null,
    tags: data.tags ?? [],
    status: data.status ? statusMap[data.status] : "New",
  };
}
