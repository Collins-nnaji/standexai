import { redirect } from "next/navigation";
import { neonAuth } from "@/lib/neon/auth-server";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = await neonAuth.getSession();

  if (session?.user) {
    redirect("/console");
  }

  return <>{children}</>;
}
