export type Buyer = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  propertyType: string;
  bhk?: string;
  purpose?: string;
  budgetMin?: number;
  budgetMax?: number;
  timeline: string;
  status: string;
  updatedAt: string;
  ownerId?: String,
  history?: {
    changedBy: string;
    changedAt: string;
    diff: Record<string, any>;
    userName?: string;
  }[];
};
