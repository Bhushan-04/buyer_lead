import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const csv: any = require("csvtojson");

const MAX_ROWS = 200;
const VALID_CITIES = ["Chandigarh","Mohali","Zirakpur","Panchkula","Other"];
const VALID_PROPERTY_TYPES = ["Apartment","Villa","Plot","Office","Retail"];
const VALID_STATUS = ["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"];

const DEMO_OWNER_ID = "demo-user-id";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const jsonArray = await csv({
      noheader: false,
      trim: true
    }).fromString(text);

    if (jsonArray.length > MAX_ROWS) {
      return NextResponse.json({ error: `Max ${MAX_ROWS} rows allowed` }, { status: 400 });
    }

    const errors: { row: number; message: string }[] = [];
    const validRows: any[] = [];

    jsonArray.forEach((row: any, idx: number) => {
      const rowNumber = idx + 2; // account for header row
      const { fullName, email, phone, city, propertyType, bhk, purpose, budgetMin, budgetMax, timeline, source, notes, tags, status } = row;

      // Basic validation
      if (!fullName || !email || !phone) {
        errors.push({ row: rowNumber, message: "fullName, email, and phone are required" });
        return;
      }
      if (city && !VALID_CITIES.includes(city)) {
        errors.push({ row: rowNumber, message: `Invalid city: ${city}` });
        return;
      }
      if (propertyType && !VALID_PROPERTY_TYPES.includes(propertyType)) {
        errors.push({ row: rowNumber, message: `Invalid propertyType: ${propertyType}` });
        return;
      }
      if (status && !VALID_STATUS.includes(status)) {
        errors.push({ row: rowNumber, message: `Invalid status: ${status}` });
        return;
      }

      validRows.push({
        fullName,
        email,
        phone,
        city: city || null,
        propertyType: propertyType || null,
        bhk: bhk || null,
        purpose: purpose || null,
        budgetMin: budgetMin ? Number(budgetMin) : null,
        budgetMax: budgetMax ? Number(budgetMax) : null,
        timeline: timeline || null,
        source: source || null,
        notes: notes || null,
        tags: ["abc"],
        status: status || null,
        ownerId: DEMO_OWNER_ID,
      });
    });

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Insert valid rows in a transaction
    await prisma.$transaction(
      validRows.map(row => prisma.buyer.create({ data: row }))
    );

    return NextResponse.json({ inserted: validRows.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to import CSV" }, { status: 500 });
  }
}
