import { redirect } from "next/navigation";

export default function LegacyScorecardRedirect() {
  redirect("/readiness-ledger");
}
