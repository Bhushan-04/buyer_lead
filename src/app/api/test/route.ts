import { prisma } from "@/lib/prisma";

export async function GET() {
  const buyers = await prisma.buyer.findMany();
  return Response.json(buyers);
}
