import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth-session";
import { getBusinessCards } from "@/lib/dashboard-data";
import BusinessCardsClient from "./BusinessCardsClient";

export default async function BusinessCardsPage() {
  const session = await getAppSession();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const cards = await getBusinessCards(userId);

  return <BusinessCardsClient initialCards={cards} />;
}

