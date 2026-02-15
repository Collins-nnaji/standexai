import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

const DEFAULT_EMAIL = process.env.DEFAULT_USER_EMAIL ?? "demo@standexai.local";
const DEFAULT_NAME = process.env.DEFAULT_USER_NAME ?? "StandexAI User";

type UserHeaderInput = {
  userIdHeader?: string;
  userEmailHeader?: string;
  userNameHeader?: string;
};

export async function getOrCreateCurrentUserId(headers?: UserHeaderInput): Promise<string> {
  const requestedUserId = headers?.userIdHeader?.trim();
  if (requestedUserId) {
    const existingById = await prisma.user.findUnique({
      where: { id: requestedUserId },
      select: { id: true },
    });
    if (existingById) return existingById.id;
  }

  const requestedEmail = headers?.userEmailHeader?.trim().toLowerCase();
  const requestedName = headers?.userNameHeader?.trim();
  const targetEmail = requestedEmail || DEFAULT_EMAIL;

  const existingByEmail = await prisma.user.findUnique({
    where: { email: targetEmail },
    select: { id: true },
  });
  if (existingByEmail) return existingByEmail.id;

  const created = await prisma.user.create({
    data: {
      email: targetEmail,
      name: requestedName || DEFAULT_NAME,
      // Placeholder hash to satisfy schema until full auth is wired.
      passwordHash: `placeholder_${randomUUID()}`,
    },
    select: { id: true },
  });

  return created.id;
}
