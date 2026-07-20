import { notFound, redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth-session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import BusinessCardEditor, { type BusinessCardEditorInitialData } from "../BusinessCardEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBusinessCardPage({ params }: PageProps) {
  const session = await getAppSession();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const userId = (session.user as any).id;

  const { data: card } = await supabaseAdmin
    .from("business_cards")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (!card) {
    notFound();
  }

  const initialData: BusinessCardEditorInitialData = {
    template: card.theme ?? "executive",
    name: card.name ?? "",
    title: card.title ?? "",
    company: card.company ?? "",
    email: card.email ?? "",
    phone: card.phone ?? "",
    website: card.website ?? "",
    address: card.address ?? "",
    googleMaps:
      card.custom_links && typeof card.custom_links.googleMaps === "string"
        ? card.custom_links.googleMaps
        : "",
    bio: card.bio ?? "",
    avatarUrl: card.avatar_url ?? "",
    linkedin: card.linkedin ?? "",
    twitter: card.twitter ?? "",
    facebook: card.facebook ?? "",
    instagram: card.instagram ?? "",
    github: card.github ?? "",
    tiktok: card.tiktok ?? "",
    youtube: card.youtube ?? "",
    snapchat:
      card.custom_links && typeof card.custom_links.snapchat === "string"
        ? card.custom_links.snapchat
        : "",
    whatsapp: card.whatsapp ?? "",
    telegram: card.telegram ?? "",
    viber:
      card.custom_links && typeof card.custom_links.viber === "string"
        ? card.custom_links.viber
        : "",
    primaryColor: card.primary_color ?? undefined,
    backgroundColor: card.background_color ?? undefined,
    fontFamily: card.font_family ?? undefined,
    status: card.status ?? "PUBLISHED",
    isPublic: card.is_public ?? true,
  };

  return <BusinessCardEditor mode="edit" cardId={card.id} initialData={initialData} />;
}
