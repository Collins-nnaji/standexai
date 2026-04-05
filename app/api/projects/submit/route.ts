import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { data: session } = await neonAuth.getSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, description, lookingFor, domain, budget, contactEmail } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Capture the submission as a ResearchBrief but inactive (pending review)
    // We can also store the 'budget' and 'contactEmail' in the description or a flattened Json field if we had one.
    // Since we don't have a 'budget' field, we'll append it to the description/metadata.
    
    const brief = await prisma.researchBrief.create({
      data: {
        title,
        description: `${description}\n\n--- MANAGED SUBMISSION METADATA ---\nBudget: ${budget}\nContact: ${contactEmail}`,
        lookingFor,
        domain,
        companyId: user.id,
        active: true, 
        isApproved: false, // Must be verified by admin first
      }
    });

    return NextResponse.json(brief);
  } catch (error) {
    console.error("[PROJECT_SUBMIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
