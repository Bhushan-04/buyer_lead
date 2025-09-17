// src/app/api/auth/demo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json(); // e.g. { "userId": "alice" }
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Ensure user exists in DB
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@demo.com`,
          name: userId.charAt(0).toUpperCase() + userId.slice(1),
        },
      });
    }

    // Set cookie
    (await cookies()).set("userId", user.id, {
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Demo login error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET handler to fetch current logged in demo user
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("Fetch current user error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
