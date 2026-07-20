import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth-session";
import { getRestaurants } from "@/lib/dashboard-data";
import MenusClient from "./MenusClient";

export default async function MenusPage() {
  const session = await getAppSession();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const restaurants = await getRestaurants(userId);

  return <MenusClient initialRestaurants={restaurants} />;
}

