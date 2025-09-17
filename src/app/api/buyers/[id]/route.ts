// src/app/api/buyers/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust if using a different DB client

// GET a single buyer
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: params.id },
    });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    return NextResponse.json(buyer);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch buyer" },
      { status: 500 }
    );
  }
}

// PUT update a buyer
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const updatedBuyer = await prisma.buyer.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedBuyer);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update buyer" },
      { status: 500 }
    );
  }
}
