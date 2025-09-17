// src/app/api/buyers/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const city = url.searchParams.get("city") || "";
    const propertyType = url.searchParams.get("propertyType") || "";
    const status = url.searchParams.get("status") || "";
    const timeline = url.searchParams.get("timeline") || "";

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (city) where.city = city;
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;
    if (timeline) where.timeline = timeline;

    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    // Transform for Excel
    const data = buyers.map((b) => ({
      fullName: b.fullName,
      phone: b.phone,
      email: b.email || "",
      city: b.city,
      propertyType: b.propertyType,
      bhk: b.bhk,
      purpose: b.purpose,
      budgetMin: b.budgetMin,
      budgetMax: b.budgetMax,
      timeline: b.timeline,
      source: b.source,
      notes: b.notes,
      tags: b.tags.join(", "),
      status: b.status,
      updatedAt: b.updatedAt.toISOString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Buyers");

    const excelBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });

    return new NextResponse(Buffer.from(excelBuffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="buyers.xlsx"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to export buyers" }, { status: 500 });
  }
}
