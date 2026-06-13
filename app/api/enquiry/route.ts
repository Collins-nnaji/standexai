import { NextResponse } from "next/server";
import { prismaDb as prisma } from "@/lib/prisma";
import { ENQUIRY_TYPES, type EnquiryType } from "@/lib/enquiry-types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const enquiryType =
      typeof body.enquiryType === "string" ? body.enquiryType.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !enquiryType || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!ENQUIRY_TYPES.includes(enquiryType as EnquiryType)) {
      return NextResponse.json({ error: "Invalid enquiry type." }, { status: 400 });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const enquiry = await prisma.standexEnquiry.create({
      data: { name, email, enquiryType, message },
    });

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (err) {
    console.error("Enquiry submission error:", err);
    return NextResponse.json({ error: "Unable to submit enquiry." }, { status: 500 });
  }
}
