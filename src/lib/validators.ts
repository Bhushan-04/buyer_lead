import { z } from "zod";

export const CityEnum = z.enum(["Chandigarh","Mohali","Zirakpur","Panchkula","Other"]);
export const PropertyTypeEnum = z.enum(["Apartment","Villa","Plot","Office","Retail"]);
export const BHKEnum = z.enum(["1","2","3","4","Studio"]);
export const PurposeEnum = z.enum(["Buy","Rent"]);
export const TimelineEnum = z.enum(["0-3m","3-6m",">6m","Exploring"]);
export const SourceEnum = z.enum(["Website","Referral","Walk-in","Call","Other"]);
export const StatusEnum = z.enum(["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"]);

export const buyerBase = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10-15 digits"),
  city: CityEnum,
  propertyType: PropertyTypeEnum,
  bhk: z.union([BHKEnum, z.undefined(), z.null()]),
  purpose: PurposeEnum,
  budgetMin: z.number().int().positive().optional().nullable(),
  budgetMax: z.number().int().positive().optional().nullable(),
  timeline: TimelineEnum,
  source: SourceEnum,
  notes: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  status: StatusEnum.optional()
});

export const createBuyerSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  city: z.enum(["Chandigarh","Mohali","Zirakpur","Panchkula","Other"]),
  propertyType: z.enum(["Apartment","Villa","Plot","Office","Retail"]),
  bhk: z.enum(["1","2","3","4","Studio"]).optional(),
  purpose: z.enum(["Buy","Rent"]),
  timeline: z.enum(["0-3m","3-6m",">6m","Exploring"]),
  source: z.enum(["Website","Referral","Walk-in","Call","Other"]),
  budgetMin: z.number().int().optional(),
  budgetMax: z.number().int().optional(),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"]).optional(),
}).refine((data) => !data.budgetMax || !data.budgetMin || data.budgetMax >= data.budgetMin, {
  message: "budgetMax must be greater than or equal to budgetMin",
  path: ["budgetMax"]
}).refine((data) => {
  if (data.propertyType === "Apartment" || data.propertyType === "Villa") {
    return !!data.bhk;
  }
  return true;
}, { message: "BHK is required for Apartment or Villa", path: ["bhk"] });


