/* eslint-disable @next/next/no-img-element */
import type { ComponentType, ReactNode } from "react";
import {
  ArrowUpRight,
  ExternalLink,
  Github,
  Globe,
  ImageIcon,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Facebook,
  Phone,
  Sparkles,
  Twitter,
} from "lucide-react";

import { RiTiktokLine } from "react-icons/ri";
import { FaStar , FaViber, FaSnapchat, FaTelegramPlane, FaWhatsapp, FaYoutube } from "react-icons/fa";
export type BusinessCardTemplateId =
  | "executive"
  | "aurora"
  | "minimal"
  | "neon"
  | "horizon"
  | "monarch";

export type BusinessCardTemplateMeta = {
  id: BusinessCardTemplateId;
  name: string;
  description: string;
  category: "Premium" | "Modern" | "Minimal" | "Bold";
  tag: string;
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
};

export type BusinessCardTemplateData = {
  name?: string | null;
  title?: string | null;
  company?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  googleMaps?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  github?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  whatsapp?: string | null;
  telegram?: string | null;
  custom_links?:
    | {
        snapchat?: string | null;
        viber?: string | null;
        googleMaps?: string | null;
        [key: string]: unknown;
      }
    | null;
  primaryColor?: string | null;
  primary_color?: string | null;
  backgroundColor?: string | null;
  background_color?: string | null;
  fontFamily?: string | null;
  font_family?: string | null;
};

export const businessCardTemplates: BusinessCardTemplateMeta[] = [
  {
    id: "executive",
    name: "Gold Prestige",
    description: "Bold black-and-gold layout inspired by premium printed business cards.",
    category: "Premium",
    tag: "Classic luxury",
    primaryColor: "#f5a400",
    backgroundColor: "#050505",
    fontFamily: "Poppins",
  },
  {
    id: "aurora",
    name: "Aurora Glass",
    description: "Modern glowing card with layered gradients and soft glass effects.",
    category: "Modern",
    tag: "Glassmorphism",
    primaryColor: "#7c3aed",
    backgroundColor: "#07111f",
    fontFamily: "Space Grotesk",
  },
  {
    id: "minimal",
    name: "Ivory Editorial",
    description: "Elegant editorial layout with a clean surface and premium typography.",
    category: "Minimal",
    tag: "Editorial",
    primaryColor: "#1f2937",
    backgroundColor: "#f7f1e8",
    fontFamily: "Manrope",
  },
  {
    id: "neon",
    name: "Neon Pulse",
    description: "A futuristic dark layout with bright electric accents and glowing panels.",
    category: "Bold",
    tag: "Futuristic",
    primaryColor: "#22d3ee",
    backgroundColor: "#060816",
    fontFamily: "Space Grotesk",
  },
  {
    id: "horizon",
    name: "Sunset Horizon",
    description: "A warm premium gradient tuned for hospitality, lifestyle, and modern brand cards.",
    category: "Modern",
    tag: "Warm gradient",
    primaryColor: "#fb7185",
    backgroundColor: "#2d1530",
    fontFamily: "Poppins",
  },
  {
    id: "monarch",
    name: "Monarch Ivory",
    description: "An elegant ivory presentation with refined typography and a luxury feel.",
    category: "Premium",
    tag: "Luxury editorial",
    primaryColor: "#7c5c38",
    backgroundColor: "#f4ece1",
    fontFamily: "Playfair Display",
  },
];

type SocialItem = {
  href: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  monogram?: string;
};

type PreviewProps = {
  templateId?: string | null;
  data: BusinessCardTemplateData;
  compact?: boolean;
  clickable?: boolean;
};

function getInitials(name?: string | null) {
  return (
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "BC"
  );
}

function getRoleLine(data: BusinessCardTemplateData) {
  const parts = [data.title, data.company].filter(Boolean);
  return parts.length > 0 ? parts.join(" at ") : "Professional Digital Card";
}

function getLogoSrc(data: BusinessCardTemplateData) {
  return data.avatarUrl || data.avatar_url || null;
}

function getPrimaryColor(data: BusinessCardTemplateData, fallback: string) {
  return data.primaryColor || data.primary_color || fallback;
}

function getBackgroundColor(data: BusinessCardTemplateData, fallback: string) {
  return data.backgroundColor || data.background_color || fallback;
}

function buildExternalHref(value: string) {
  if (/^(https?:\/\/|mailto:|tel:|viber:\/\/)/i.test(value)) {
    return value;
  }
  return `https://${value}`;
}

function buildPhoneHref(value?: string | null) {
  if (!value) return null;
  const digits = value.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

function buildEmailHref(value?: string | null) {
  return value ? `mailto:${value}` : null;
}

function buildWebsiteHref(value?: string | null) {
  return value ? buildExternalHref(value) : null;
}

function getCustomLink(data: BusinessCardTemplateData, key: "snapchat" | "viber" | "googleMaps") {
  const customLinks = data.custom_links;
  const value = customLinks?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getGoogleMapsHref(data: BusinessCardTemplateData) {
  const mapsLink =
    (typeof data.googleMaps === "string" && data.googleMaps.trim() ? data.googleMaps.trim() : null) ||
    getCustomLink(data, "googleMaps");
  if (mapsLink) {
    return buildExternalHref(mapsLink);
  }

  if (data.address?.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address.trim())}`;
  }

  return null;
}

function buildSocialHref(kind: string, value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (kind === "whatsapp") {
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const digits = trimmed.replace(/[^\d]/g, "");
    return digits ? `https://wa.me/${digits}` : `https://wa.me/${encodeURIComponent(trimmed)}`;
  }

  if (kind === "telegram") {
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://t.me/${trimmed.replace(/^@/, "")}`;
  }

  if (kind === "snapchat") {
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://www.snapchat.com/add/${trimmed.replace(/^@/, "")}`;
  }

  if (kind === "viber") {
    if (/^(https?:\/\/|viber:\/\/)/i.test(trimmed)) return trimmed;
    const digits = trimmed.replace(/[^\d+]/g, "");
    return digits
      ? `viber://chat?number=${encodeURIComponent(digits)}`
      : `viber://chat?number=${encodeURIComponent(trimmed)}`;
  }

  return buildExternalHref(trimmed);
}

function getSocialItems(data: BusinessCardTemplateData): SocialItem[] {
  const items: SocialItem[] = [];

  const candidates: Array<{
    key: string;
    label: string;
    raw: string | null | undefined;
    icon?: ComponentType<{ className?: string }>;
    monogram?: string;
  }> = [
    { key: "facebook", label: "Facebook", raw: data.facebook, icon: Facebook },
    { key: "instagram", label: "Instagram", raw: data.instagram, icon: Instagram },
    { key: "tiktok", label: "TikTok", raw: data.tiktok, icon: RiTiktokLine  },
    { key: "twitter", label: "Twitter", raw: data.twitter, icon: Twitter },
    { key: "linkedin", label: "LinkedIn", raw: data.linkedin, icon: Linkedin },
    { key: "whatsapp", label: "WhatsApp", raw: data.whatsapp, icon: FaWhatsapp },
    { key: "telegram", label: "Telegram", raw: data.telegram, icon: FaTelegramPlane },
    { key: "viber", label: "Viber", raw: getCustomLink(data, "viber"),icon: FaViber },
    { key: "snapchat", label: "Snapchat", raw: getCustomLink(data, "snapchat"), icon: FaSnapchat },
    { key: "github", label: "GitHub", raw: data.github, icon: Github },
    { key: "youtube", label: "YouTube", raw: data.youtube, icon: FaYoutube },
  ];

  for (const candidate of candidates) {
    const href = buildSocialHref(candidate.key, candidate.raw);
    if (href) {
      items.push({
        href,
        label: candidate.label,
        icon: candidate.icon,
        monogram: candidate.monogram,
      });
    }
  }

  return items;
}

function ActionWrapper({
  href,
  clickable,
  className,
  children,
}: {
  href?: string | null;
  clickable: boolean;
  className: string;
  children: ReactNode;
}) {
  if (clickable && href) {
    const external = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        className={className}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return <div className={className}>{children}</div>;
}

function LogoBadge({
  data,
  compact,
  className,
  imageClassName,
}: {
  data: BusinessCardTemplateData;
  compact: boolean;
  className: string;
  imageClassName: string;
}) {
  const logoSrc = getLogoSrc(data);

  if (logoSrc) {
    return (
      <div className={className}>
        <img src={logoSrc} alt={data.name || "Business logo"} className={imageClassName} />
      </div>
    );
  }

  return (
    <div className={className}>
      {compact ? <ImageIcon className="h-5 w-5" /> : <span>{getInitials(data.name)}</span>}
    </div>
  );
}

function SocialBadge({
  social,
  clickable,
  compact,
  className,
}: {
  social: SocialItem;
  clickable: boolean;
  compact: boolean;
  className: string;
}) {
  const Icon = social.icon;
  const content = (
    <>
      {Icon ? (
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
      ) : (
        <span className={compact ? "text-[9px] font-bold uppercase" : "text-[10px] font-bold uppercase"}>
          {social.monogram}
        </span>
      )}
    </>
  );

  return (
    <ActionWrapper href={social.href} clickable={clickable} className={className}>
      {content}
    </ActionWrapper>
  );
}

function ExecutiveTemplate({
  data,
  compact,
  clickable,
}: {
  data: BusinessCardTemplateData;
  compact: boolean;
  clickable: boolean;
}) {
  const primaryColor = getPrimaryColor(data, "#f5a400");
  const backgroundColor = getBackgroundColor(data, "#050505");
  const socials = getSocialItems(data);
  const googleMapsHref = getGoogleMapsHref(data);
  const wrapper = compact ? "rounded-[24px]" : "rounded-[34px]";
  const bodyPadding = compact ? "px-4 pb-4 pt-5" : "px-4 pb-6 pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8";
  const titleSize = compact ? "text-lg" : "text-3xl sm:text-4xl lg:text-5xl";
  const subtitleSize = compact ? "text-[10px]" : "text-sm sm:text-base lg:text-xl";
  const textSize = compact ? "text-[11px]" : "text-sm sm:text-base";
  const iconSize = compact ? "h-3.5 w-3.5" : "h-5 w-5";
  const socialCircle = compact ? "h-8 w-8 text-black" : "h-12 w-12 text-black";

  return (
    <div
      className={`w-full overflow-hidden border border-amber-300/25 bg-black text-white shadow-2xl ${wrapper}`}
      style={{ backgroundColor }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 sm:px-6"
        style={{ backgroundColor: primaryColor }}
      >
     

      </div>

      <div className={`${bodyPadding} text-center`}>
        <LogoBadge
          data={data}
          compact={compact}
          className={`mx-auto flex items-center justify-center overflow-hidden rounded-full border-4 border-black/70 font-black text-black shadow-[0_0_0_4px_rgba(255,255,255,0.15)] ${
            compact ? "h-20 w-20 text-xl" : "h-28 w-28 text-3xl sm:h-42 sm:w-42 sm:text-4xl"
          }`}
          imageClassName="h-full w-full object-st"
        />
        { /* stars */}
        <div className="mx-auto flex items-center justify-center gap-2 mt-4">
        <FaStar className="h-7 w-7 text-amber-400" /> 
        <FaStar className="h-7 w-7 text-amber-400" /> 
        <FaStar className="h-7 w-7 text-amber-400" /> 
        <FaStar className="h-7 w-7 text-amber-400" /> 
        <FaStar className="h-7 w-7 text-amber-400" /> 
      
        </div>
        <h2 className={`mt-5 font-black uppercase tracking-tight ${titleSize}`}>
          {data.name || "Your Business Name"}
        </h2>
        <p className={`mt-2 font-semibold uppercase tracking-wide text-white/90 ${subtitleSize}`}>
          {data.title || "#1 Platform For Digital Business"}
        </p>
        <p className={`mx-auto mt-3 max-w-3xl text-white/75 ${textSize}`}>
          {data.bio || "Brief description of your business comes here."}
        </p>

        <div className={`mx-auto mt-6 max-w-2xl space-y-4 ${compact ? "text-[11px]" : "text-base"}`}>
          {data.phone && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-amber-400/70" />
                <Phone className={iconSize} style={{ color: primaryColor }} />
                <div className="h-px flex-1 bg-amber-400/70" />
              </div>
              <ActionWrapper
                href={buildPhoneHref(data.phone)}
                clickable={clickable}
                className="block font-medium text-white/90 transition hover:text-white"
              >
                {data.phone}
              </ActionWrapper>
            </>
          )}

          {data.email && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-amber-400/70" />
                <Mail className={iconSize} style={{ color: primaryColor }} />
                <div className="h-px flex-1 bg-amber-400/70" />
              </div>
              <ActionWrapper
                href={buildEmailHref(data.email)}
                clickable={clickable}
                className="block font-medium text-white/90 transition hover:text-white"
              >
                {data.email}
              </ActionWrapper>
            </>
          )}

          {data.website && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-amber-400/70" />
                <Globe className={iconSize} style={{ color: primaryColor }} />
                <div className="h-px flex-1 bg-amber-400/70" />
              </div>
              <ActionWrapper
                href={buildWebsiteHref(data.website)}
                clickable={clickable}
                className="block font-medium text-white/90 transition hover:text-white"
              >
                {data.website}
              </ActionWrapper>
              {!compact && (
                <ActionWrapper
                  href={buildWebsiteHref(data.website)}
                  clickable={clickable}
                  className="inline-flex rounded-sm bg-white px-4 py-1.5 text-sm font-medium text-black display-flex justify-center align-center"
                >
                 Visite Our Website
                </ActionWrapper>
              )}
            </>
          )}

          {data.address && (
            <ActionWrapper
              href={googleMapsHref}
              clickable={clickable}
              className="block text-white/80 transition hover:text-white"
            >
              {data.address}
            </ActionWrapper>
          )}
          {!compact && googleMapsHref && (
            <ActionWrapper
              href={googleMapsHref}
              clickable={clickable}
              className="inline-flex rounded-sm border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Open In Google Maps
            </ActionWrapper>
          )}
        </div>

        <div className={`mt-6 flex flex-wrap justify-center gap-3 ${compact ? "gap-2" : "gap-3.5"}`}>
          {socials.length > 0
            ? socials.map((social) => (
                <SocialBadge
                  key={social.label}
                  social={social}
                  clickable={clickable}
                  compact={compact}
                  className={`flex items-center justify-center rounded-full bg-gradient-to-br from-[#f8e3b8] via-[#f6c77a] to-[#d08d2d] shadow-lg transition hover:scale-105 ${socialCircle}`}
                />
              ))
            : [Phone, Mail, Globe].map((Icon, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center rounded-full bg-gradient-to-br from-[#f8e3b8] via-[#f6c77a] to-[#d08d2d] shadow-lg ${socialCircle}`}
                >
                  <Icon className={compact ? "h-4 w-4 text-black" : "h-5 w-5 text-black"} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

function AuroraTemplate({
  data,
  compact,
  clickable,
}: {
  data: BusinessCardTemplateData;
  compact: boolean;
  clickable: boolean;
}) {
  const primaryColor = getPrimaryColor(data, "#7c3aed");
  const backgroundColor = getBackgroundColor(data, "#07111f");
  const socials = getSocialItems(data);
  const googleMapsHref = getGoogleMapsHref(data);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[30px] border border-white/10 text-white shadow-2xl ${
        compact ? "p-4" : "p-4 sm:p-6 lg:p-8"
      }`}
      style={{
        background: `radial-gradient(circle at top right, ${primaryColor}55, transparent 35%), linear-gradient(135deg, ${backgroundColor}, #020617)`,
      }}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div
        className="absolute bottom-0 left-0 h-32 w-32 rounded-full blur-3xl"
        style={{ backgroundColor: `${primaryColor}44` }}
      />

      <div className="relative rounded-[26px] border border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className={compact ? "p-4" : "p-5 sm:p-6 lg:p-8"}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-white/80 ${
                  compact ? "text-[10px]" : "text-xs"
                }`}
              >
                <Sparkles className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
                Aurora Template
              </div>
              <h2 className={`mt-4 font-semibold ${compact ? "text-lg" : "text-3xl sm:text-4xl lg:text-5xl"}`}>
                {data.name || "Your Name"}
              </h2>
              <p className={`mt-2 text-white/75 ${compact ? "text-[11px]" : "text-base"}`}>
                {getRoleLine(data)}
              </p>
            </div>
            <LogoBadge
              data={data}
              compact={compact}
              className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-white/15 bg-white/10 font-bold text-white ${
                compact ? "h-[72px] w-[72px] text-base" : "h-48 w-48 text-2xl"
              }`}
              imageClassName="h-full w-full object-cover"
            />
          </div>

          <p className={`mt-5 max-w-3xl text-white/70 ${compact ? "text-[11px]" : "text-base leading-7"}`}>
            {data.bio || "A modern digital profile with luminous gradients and a refined glass surface."}
          </p>

          <div className={`mt-6 grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {[
              { label: "Email", value: data.email, icon: Mail, href: buildEmailHref(data.email) },
              { label: "Phone", value: data.phone, icon: Phone, href: buildPhoneHref(data.phone) },
              { label: "Website", value: data.website, icon: Globe, href: buildWebsiteHref(data.website) },
              { label: "Address", value: data.address, icon: MapPin, href: googleMapsHref },
            ]
              .filter((item) => item.value)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <ActionWrapper
                    key={item.label}
                    href={item.href}
                    clickable={clickable}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-black/30"
                  >
                    <div className="flex items-center gap-2 text-white/60">
                      <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                      <span className={compact ? "text-[10px]" : "text-xs uppercase tracking-[0.25em]"}>
                        {item.label}
                      </span>
                    </div>
                    <div className={`mt-2 text-white ${compact ? "text-[11px]" : "text-sm"}`}>{item.value}</div>
                  </ActionWrapper>
                );
              })}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {socials.length > 0 ? (
              socials.map((social) => {
                const Icon = social.icon;
                return (
                  <ActionWrapper
                    key={social.label}
                    href={social.href}
                    clickable={clickable}
                    className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-white transition hover:bg-white/15 ${
                      compact ? "text-[10px]" : "text-xs"
                    }`}
                  >
                    {Icon ? (
                      <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                    ) : (
                      <span className="text-[10px] font-bold uppercase">{social.monogram}</span>
                    )}
                    {social.label}
                  </ActionWrapper>
                );
              })
            ) : (
              <div
                className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-white ${
                  compact ? "text-[10px]" : "text-xs"
                }`}
              >
                <ArrowUpRight className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                Add social links
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalTemplate({
  data,
  compact,
  clickable,
}: {
  data: BusinessCardTemplateData;
  compact: boolean;
  clickable: boolean;
}) {
  const primaryColor = getPrimaryColor(data, "#1f2937");
  const backgroundColor = getBackgroundColor(data, "#f7f1e8");
  const socials = getSocialItems(data);
  const googleMapsHref = getGoogleMapsHref(data);

  return (
    <div
      className={`w-full overflow-hidden rounded-[30px] border border-black/10 text-slate-900 shadow-xl ${
        compact ? "p-4" : "p-4 sm:p-6 lg:p-8"
      }`}
      style={{ backgroundColor }}
    >
      <div className={`grid gap-5 ${compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[0.82fr_1.18fr]"}`}>
        <div
          className={`rounded-[24px] text-white ${compact ? "p-4" : "p-6 lg:p-8"}`}
          style={{ background: `linear-gradient(160deg, ${primaryColor}, #111827)` }}
        >
          <LogoBadge
            data={data}
            compact={compact}
            className={`mb-4 flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-center font-semibold ${
              compact ? "h-[72px] w-[72px] text-base" : "h-28 w-28 text-2xl"
            }`}
            imageClassName="h-full w-full object-cover"
          />
          <div
            className={
              compact
                ? "text-[10px] uppercase tracking-[0.25em] text-white/60"
                : "text-xs uppercase tracking-[0.35em] text-white/60"
            }
          >
            Editorial Card
          </div>
          <div className={`mt-3 font-semibold ${compact ? "text-base" : "text-2xl sm:text-3xl"}`}>
            {data.name || "Your Name"}
          </div>
          <div className={`mt-2 text-white/75 ${compact ? "text-[11px]" : "text-sm"}`}>
            {getRoleLine(data)}
          </div>
        </div>

        <div className={compact ? "p-1" : "p-2"}>
          <div className={`border-b border-black/10 pb-4 ${compact ? "mb-4" : "mb-6"}`}>
            <div className={`font-semibold ${compact ? "text-base" : "text-3xl lg:text-4xl"}`}>
              {data.company || "Business Identity"}
            </div>
            <p className={`mt-2 text-slate-600 ${compact ? "text-[11px]" : "text-sm leading-7"}`}>
              {data.bio || "A refined and minimal business card design with strong typography and calm spacing."}
            </p>
          </div>

          <div className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {[
              { label: "Email", value: data.email, href: buildEmailHref(data.email) },
              { label: "Phone", value: data.phone, href: buildPhoneHref(data.phone) },
              { label: "Website", value: data.website, href: buildWebsiteHref(data.website) },
              { label: "Address", value: data.address, href: googleMapsHref },
            ]
              .filter((item) => item.value)
              .map((item) => (
                <ActionWrapper
                  key={item.label}
                  href={item.href}
                  clickable={clickable}
                  className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 transition hover:bg-white/85"
                >
                  <div
                    className={
                      compact
                        ? "text-[10px] uppercase tracking-[0.2em] text-slate-500"
                        : "text-xs uppercase tracking-[0.25em] text-slate-500"
                    }
                  >
                    {item.label}
                  </div>
                  <div className={`mt-2 ${compact ? "text-[11px]" : "text-sm"}`}>{item.value}</div>
                </ActionWrapper>
              ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <ActionWrapper
                  key={social.label}
                  href={social.href}
                  clickable={clickable}
                  className={`inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 transition hover:bg-slate-50 ${
                    compact ? "text-[10px]" : "text-xs"
                  }`}
                >
                  {Icon ? (
                    <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                  ) : (
                    <span className="text-[10px] font-bold uppercase">{social.monogram}</span>
                  )}
                  {social.label}
                  {!compact && <ExternalLink className="h-3.5 w-3.5 opacity-60" />}
                </ActionWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessCardTemplatePreview({
  templateId,
  data,
  compact = false,
  clickable = false,
}: PreviewProps) {
  switch (templateId) {
    case "aurora":
    case "neon":
      return <AuroraTemplate data={data} compact={compact} clickable={clickable} />;
    case "minimal":
    case "monarch":
      return <MinimalTemplate data={data} compact={compact} clickable={clickable} />;
    case "horizon":
    case "executive":
    default:
      return <ExecutiveTemplate data={data} compact={compact} clickable={clickable} />;
  }
}
