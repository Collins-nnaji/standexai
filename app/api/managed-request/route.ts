import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { data: session } = await neonAuth.getSession();

  try {
    const body = await req.json();
    const { companyName, contactName, email, description, budgetRange, timeline } = body;

    // basic validation
    if (!companyName || !contactName || !email || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await prisma.managedProjectRequest.create({
      data: {
        companyName,
        contactName,
        email,
        description,
        budgetRange,
        timeline,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, id: request.id });
  } catch (err) {
    console.error("Consulting Request Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
