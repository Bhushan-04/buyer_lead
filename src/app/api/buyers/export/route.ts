import { NextRequest, NextResponse } from "next/server";
import { Parser } from "json2csv";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { search, city, propertyType, status } = Object.fromEntries(req.nextUrl.searchParams.entries());

    const buyers = await prisma.buyer.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { fullName: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                  { phone: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          city ? { city: city as any } : {},
          propertyType ? { propertyType: propertyType as any } : {},
          status ? { status: status as any } : {},
        ],
      },
    });

    const fields = [
      "fullName","email","phone","city","propertyType","bhk","purpose",
      "budgetMin","budgetMax","timeline","source","notes","tags","status"
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(buyers);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=buyers.csv",
      },
    });
  } catch (err) {
    return new Response("Failed to export CSV", { status: 500 });
  }
}
