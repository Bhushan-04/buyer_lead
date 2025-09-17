// src/pages/api/buyers.ts (or app/api/buyers/route.ts)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());

    // Pagination
    const page = parseInt(params.page || "1");
    const pageSize = parseInt(params.pageSize || "10");
    const skip = (page - 1) * pageSize;

    // Filters (only strings)
    const filters: Record<string, string> = {};
    ["city", "propertyType", "status"].forEach((key) => {
      if (params[key]) filters[key] = params[key];
    });

    // Search (partial match on fullName, email, phone)
    const search = params.search?.trim();

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    // Enum filters
    if (filters.city) where.city = { equals: filters.city };
    if (filters.propertyType) where.propertyType = { equals: filters.propertyType };
    if (filters.status) where.status = { equals: filters.status };

    const [rows, count] = await Promise.all([
      prisma.buyer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.buyer.count({ where }),
    ]);

    return NextResponse.json({ rows, count });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ rows: [], count: 0 }, { status: 500 });
  }
}
