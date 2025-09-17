// src/app/api/buyers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Helper: get current user from cookie
async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

// -------------------------
// GET (anyone logged in can read)
// -------------------------
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const buyerId = params.id;

    const buyer = await prisma.buyer.findUnique({
      where: { id: buyerId },
      include: {
        BuyerHistory: {
          take: 5,
          orderBy: { changedAt: "desc" },
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    const history = buyer.BuyerHistory.map((h) => ({
      changedBy: h.changedBy,
      userName: h.user?.name,
      changedAt: h.changedAt.toISOString(),
      diff: h.diff,
    }));

    return NextResponse.json({
      ...buyer,
      updatedAt: buyer.updatedAt.toISOString(),
      history,
    });
  } catch (err: any) {
    console.error("GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -------------------------
// PUT (only owner can edit)
// -------------------------
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const buyerId = params.id;
    const body = await req.json();
    const { updatedAt, ...fields } = body;

    const existing = await prisma.buyer.findUnique({ where: { id: buyerId } });
    if (!existing) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    // Ownership check
    if (existing.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Concurrency check
    if (new Date(existing.updatedAt).getTime() !== new Date(updatedAt).getTime()) {
      return NextResponse.json({ error: "Record changed, please refresh" }, { status: 409 });
    }

    // Update buyer
    const updatedBuyer = await prisma.buyer.update({
      where: { id: buyerId },
      data: fields,
    });

    // Log history (diff)
    const diff: Record<string, { old: any; new: any }> = {};
    Object.keys(fields).forEach((key) => {
      if ((existing as any)[key] !== (fields as any)[key]) {
        diff[key] = { old: (existing as any)[key], new: (fields as any)[key] };
      }
    });

    if (Object.keys(diff).length > 0) {
      await prisma.buyerHistory.create({
        data: {
          buyerId,
          changedBy: user.id,
          diff,
        },
      });
    }

    return NextResponse.json(updatedBuyer);
  } catch (err: any) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -------------------------
// DELETE (only owner can delete)
// -------------------------
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const buyerId = params.id;
    const existing = await prisma.buyer.findUnique({ where: { id: buyerId } });
    if (!existing) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    // Ownership check
    if (existing.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.buyer.delete({ where: { id: buyerId } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
