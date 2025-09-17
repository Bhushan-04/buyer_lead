import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import { createBuyerSchema } from "@/lib/validators";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const text = await file.text();

    const rows: any[] = [];
    const errors: { row: number; message: string }[] = [];

    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        result.data.forEach((row: any, index: number) => {
          const parsed = createBuyerSchema.safeParse(row);
          if (!parsed.success) {
            errors.push({ row: index + 2, message: JSON.stringify(parsed.error.format()) });
          } else {
            rows.push(parsed.data);
          }
        });
      },
    });

    if (errors.length) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    await prisma.$transaction(
      rows.map((data) =>
        prisma.buyer.create({
          data,
        })
      )
    );

    return NextResponse.json({ inserted: rows.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
