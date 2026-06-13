"use client";

import type { NeonAuthSession } from "@/lib/neon/auth-server";

const authDisabled = { message: "Authentication is not configured." };

/** Auth is disabled — app runs with DATABASE_URL only. */
export const neonAuthClient = {
  useSession: (): { data: NeonAuthSession; isPending: false; error: null } => ({
    data: null,
    isPending: false,
    error: null,
  }),
  signUp: {
    email: async () => ({ error: authDisabled, data: null }),
  },
  signIn: {
    email: async () => ({ error: authDisabled, data: null }),
    social: async () => ({ error: authDisabled, data: null }),
  },
  signOut: async () => ({ error: null }),
};
