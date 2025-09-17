import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const demoUserId = "demo-user-1";

    // Check if demo user exists
    let user = await prisma.user.findUnique({ where: { id: demoUserId } });

    // Create demo user if not exists
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: demoUserId,
          email: "demo@example.com",
          name: "Demo User",
        },
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
