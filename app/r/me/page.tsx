import { redirect } from "next/navigation";
import { neonAuth } from "@/lib/neon/auth-server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RedirectToSelf() {
  const { data: session } = await neonAuth.getSession();
  
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (user?.id) {
    redirect(`/r/${user.id}`);
  } else {
    redirect("/onboarding");
  }
}
