import { NextResponse } from "next/server";

export type NeonAuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
};

export type NeonAuthSession = {
  user?: NeonAuthUser | null;
} | null;

/** Auth is disabled — app runs with DATABASE_URL only. */
export const neonAuth = {
  getSession: async (): Promise<{ data: NeonAuthSession }> => ({ data: null }),
  middleware: () => () => NextResponse.next(),
  handler: () => ({
    GET: () => NextResponse.json({ error: "Authentication is not configured." }, { status: 501 }),
    POST: () => NextResponse.json({ error: "Authentication is not configured." }, { status: 501 }),
    PUT: () => NextResponse.json({ error: "Authentication is not configured." }, { status: 501 }),
    DELETE: () => NextResponse.json({ error: "Authentication is not configured." }, { status: 501 }),
    PATCH: () => NextResponse.json({ error: "Authentication is not configured." }, { status: 501 }),
  }),
};
