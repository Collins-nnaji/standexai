import { neonAuth } from "@/lib/neon/auth-server";

const handler = neonAuth.handler();

export const { GET, POST, PUT, DELETE, PATCH } = handler;
