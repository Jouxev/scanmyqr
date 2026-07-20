import { notFound, redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth-session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import BusinessCardEditor, { type BusinessCardEditorInitialData } from "../BusinessCardEditor";
import type { BusinessCardTemplateId } from "@/components/business-card-template";
import type { Database } from "@/types/database";

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

  const businessCardsTable = supabaseAdmin.from("business_cards") as any;
  const { data: card } = (await businessCardsTable
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()) as { data: Database["public"]["Tables"]["business_cards"]["Row"] | null };

  if (!card) {
    notFound();
  }

  const customLinks =
    card.custom_links && typeof card.custom_links === "object" && !Array.isArray(card.custom_links)
      ? card.custom_links
      : null;
  const validTemplates: BusinessCardTemplateId[] = [
    "executive",
    "aurora",
    "minimal",
    "neon",
    "horizon",
    "monarch",
  ];
  const template = validTemplates.includes(card.theme as BusinessCardTemplateId)
    ? (card.theme as BusinessCardTemplateId)
    : "executive";

  const initialData: BusinessCardEditorInitialData = {
    template,
    name: card.name ?? "",
    title: card.title ?? "",
    company: card.company ?? "",
    email: card.email ?? "",
    phone: card.phone ?? "",
    website: card.website ?? "",
    address: card.address ?? "",
    googleMaps:
      customLinks && typeof customLinks.googleMaps === "string"
        ? customLinks.googleMaps
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
      customLinks && typeof customLinks.snapchat === "string"
        ? customLinks.snapchat
        : "",
    whatsapp: card.whatsapp ?? "",
    telegram: card.telegram ?? "",
    viber:
      customLinks && typeof customLinks.viber === "string"
        ? customLinks.viber
        : "",
    primaryColor: card.primary_color ?? undefined,
    backgroundColor: card.background_color ?? undefined,
    fontFamily: card.font_family ?? undefined,
    status: card.status ?? "PUBLISHED",
    isPublic: card.is_public ?? true,
  };

  return <BusinessCardEditor mode="edit" cardId={card.id} initialData={initialData} />;
}
