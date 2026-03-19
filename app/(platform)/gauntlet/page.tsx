import { redirect } from "next/navigation";

export default function LegacyGauntletRedirect() {
  redirect("/data-diagnostics");
}
