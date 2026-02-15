import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import { ensurePrismaConnected, prisma, withPrismaReconnect } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

const INDUSTRY_VALUES = ["FINTECH", "INSURANCE", "HEALTHCARE", "LENDING", "SAAS", "INVESTMENT", "CRYPTO"] as const;
const ROLE_VALUES = ["ADMIN", "WRITER", "REVIEWER", "VIEWER"] as const;

type IndustryValue = (typeof INDUSTRY_VALUES)[number];
type RoleValue = (typeof ROLE_VALUES)[number];

type UpdatePayload = {
  name?: string;
  companyName?: string;
  role?: string;
  industry?: string | null;
  avatar?: string | null;
};

function isIndustryValue(value: string): value is IndustryValue {
  return INDUSTRY_VALUES.includes(value as IndustryValue);
}

function isRoleValue(value: string): value is RoleValue {
  return ROLE_VALUES.includes(value as RoleValue);
}

async function requireAuthedUser() {
  const { data: session } = await neonAuth.getSession();
  const authUser = session?.user;
  const email = authUser?.email?.trim().toLowerCase();
  if (!email) return null;

  const userId = await getOrCreateCurrentUserId({
    userEmailHeader: email,
    userNameHeader: authUser?.name ?? undefined,
  });

  return { userId, authName: authUser?.name ?? null };
}

export async function GET() {
  try {
    await ensurePrismaConnected();
    const authed = await requireAuthedUser();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await withPrismaReconnect(() =>
      prisma.user.findUnique({
        where: { id: authed.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          industry: true,
          companyName: true,
          avatar: true,
        },
      }),
    );

    if (!user) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile: {
        id: user.id,
        email: user.email,
        name: user.name ?? authed.authName ?? "",
        role: user.role,
        industry: user.industry,
        companyName: user.companyName ?? "",
        avatar: user.avatar ?? "",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await ensurePrismaConnected();
    const authed = await requireAuthedUser();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as UpdatePayload;

    const name = (body.name ?? "").trim();
    const companyName = (body.companyName ?? "").trim();
    const role = (body.role ?? "").trim().toUpperCase();
    const industryRaw = (body.industry ?? "").trim().toUpperCase();
    const avatar = (body.avatar ?? "").trim();

    if (name.length > 120 || companyName.length > 160 || avatar.length > 500) {
      return NextResponse.json({ error: "One or more fields are too long" }, { status: 400 });
    }
    if (role && !isRoleValue(role)) {
      return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
    }
    if (industryRaw && !isIndustryValue(industryRaw)) {
      return NextResponse.json({ error: "Invalid industry value" }, { status: 400 });
    }

    const updated = await withPrismaReconnect(() =>
      prisma.user.update({
        where: { id: authed.userId },
        data: {
          name: name || null,
          companyName: companyName || null,
          role: role ? (role as RoleValue) : undefined,
          industry: industryRaw ? (industryRaw as IndustryValue) : null,
          avatar: avatar || null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          industry: true,
          companyName: true,
          avatar: true,
          updatedAt: true,
        },
      }),
    );

    return NextResponse.json({
      profile: {
        ...updated,
        companyName: updated.companyName ?? "",
        avatar: updated.avatar ?? "",
        name: updated.name ?? "",
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
