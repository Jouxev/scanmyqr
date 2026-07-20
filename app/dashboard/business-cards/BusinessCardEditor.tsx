"use client";

import { type ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  Github,
  Globe,
  Instagram,
  LayoutTemplate,
  Linkedin,
  MapPin,
  MessageCircle,
  Palette,
  Play,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SwatchBook,
  Twitter,
  Wand2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  businessCardTemplates,
  BusinessCardTemplatePreview,
  type BusinessCardTemplateId,
} from "@/components/business-card-template";

type CreatedCardState = {
  id: string;
  slug: string;
  publicUrl: string;
};

type FormState = {
  template: BusinessCardTemplateId;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  googleMaps: string;
  bio: string;
  avatarUrl: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  github: string;
  tiktok: string;
  youtube: string;
  snapchat: string;
  whatsapp: string;
  telegram: string;
  viber: string;
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  status: string;
  isPublic: boolean;
};

export type BusinessCardEditorInitialData = Partial<FormState>;

type BusinessCardEditorProps = {
  mode: "create" | "edit";
  cardId?: string;
  initialData?: BusinessCardEditorInitialData;
};

type Step = 1 | 2;
type PreviewMode = "full" | "compact";
type TemplateFilter = "All" | "Premium" | "Modern" | "Minimal" | "Bold";
type SocialFieldKey =
  | "facebook"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "tiktok"
  | "github"
  | "snapchat"
  | "whatsapp"
  | "telegram"
  | "viber"
  | "youtube";

const initialTemplate = businessCardTemplates[0];
const defaultFormState: FormState = {
  template: initialTemplate.id,
  name: "",
  title: "",
  company: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  googleMaps: "",
  bio: "",
  avatarUrl: "",
  linkedin: "",
  twitter: "",
  facebook: "",
  instagram: "",
  github: "",
  tiktok: "",
  youtube: "",
  snapchat: "",
  whatsapp: "",
  telegram: "",
  viber: "",
  primaryColor: initialTemplate.primaryColor,
  backgroundColor: initialTemplate.backgroundColor,
  fontFamily: initialTemplate.fontFamily,
  status: "PUBLISHED",
  isPublic: true,
};

const templateFilters: TemplateFilter[] = ["All", "Premium", "Modern", "Minimal", "Bold"];
const fontOptions = [
  "Poppins",
  "Inter",
  "Manrope",
  "Space Grotesk",
  "Playfair Display",
  "DM Sans",
  "Montserrat",
];
const palettePresets = [
  { name: "Ocean", primaryColor: "#22d3ee", backgroundColor: "#071827", fontFamily: "Inter" },
  { name: "Royal", primaryColor: "#8b5cf6", backgroundColor: "#120c2e", fontFamily: "Space Grotesk" },
  { name: "Sunset", primaryColor: "#fb7185", backgroundColor: "#2d1530", fontFamily: "Poppins" },
  { name: "Forest", primaryColor: "#34d399", backgroundColor: "#08231b", fontFamily: "Manrope" },
  { name: "Ivory", primaryColor: "#7c5c38", backgroundColor: "#f4ece1", fontFamily: "Playfair Display" },
  { name: "Slate", primaryColor: "#334155", backgroundColor: "#f8fafc", fontFamily: "Inter" },
];
const socialFields: Array<{
  id: SocialFieldKey;
  label: string;
  placeholder: string;
  icon?: ReactNode;
  badge?: string;
}> = [
  { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/...", badge: "f" },
  {
    id: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/...",
    icon: <Linkedin className="h-4 w-4" />,
  },
  {
    id: "twitter",
    label: "Twitter / X",
    placeholder: "https://x.com/...",
    icon: <Twitter className="h-4 w-4" />,
  },
  {
    id: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/...",
    icon: <Instagram className="h-4 w-4" />,
  },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@...", badge: "tt" },
  {
    id: "github",
    label: "GitHub",
    placeholder: "https://github.com/...",
    icon: <Github className="h-4 w-4" />,
  },
  { id: "snapchat", label: "Snapchat", placeholder: "@yourhandle", badge: "sc" },
  {
    id: "whatsapp",
    label: "WhatsApp",
    placeholder: "+213...",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    id: "telegram",
    label: "Telegram",
    placeholder: "@username",
    icon: <Send className="h-4 w-4" />,
  },
  { id: "viber", label: "Viber", placeholder: "+213...", badge: "vb" },
  {
    id: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@...",
    icon: <Play className="h-4 w-4" />,
  },
];

function clsx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function StepChip({
  number,
  title,
  active,
  done,
}: {
  number: Step;
  title: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.5rem] border px-4 py-4 transition-all duration-300 ${
        active
          ? "border-cyan-300/20 bg-gradient-to-br from-cyan-400/14 via-blue-500/10 to-violet-500/12 shadow-xl shadow-slate-950/20"
          : "border-white/10 bg-white/[0.045]"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="relative flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${
          active || done
            ? "bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-lg shadow-blue-950/30"
            : "bg-white/5 text-slate-400"
        }`}
      >
        {done ? <Check className="h-4 w-4" /> : number}
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Step {number}</div>
        <div className="text-sm font-medium text-white">{title}</div>
      </div>
      </div>
    </div>
  );
}

function SocialField({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon,
  badge,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  badge?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-slate-200">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200">
          {icon || <span className="text-[10px] font-bold uppercase">{badge}</span>}
        </span>
        <span>{label}</span>
      </Label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200">
            {icon || <span className="text-[10px] font-bold uppercase">{badge}</span>}
          </span>
        </div>
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 rounded-2xl border-white/10 bg-slate-950/40 pl-14 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-400/60"
        />
      </div>
    </div>
  );
}

export default function BusinessCardEditor({
  mode,
  cardId,
  initialData,
}: BusinessCardEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>(mode === "edit" ? 2 : 1);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("full");
  const [templateFilter, setTemplateFilter] = useState<TemplateFilter>("All");
  const [templateSearch, setTemplateSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [createdCard, setCreatedCard] = useState<CreatedCardState | null>(null);
  const [qrImage, setQrImage] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [form, setForm] = useState<FormState>(() => ({
    ...defaultFormState,
    ...initialData,
  }));

  const activeTemplate = useMemo(
    () =>
      businessCardTemplates.find((template) => template.id === form.template) ??
      businessCardTemplates[0],
    [form.template]
  );
  const visibleTemplates = useMemo(() => {
    return businessCardTemplates.filter((template) => {
      const matchesFilter = templateFilter === "All" || template.category === templateFilter;
      const search = templateSearch.trim().toLowerCase();
      const matchesSearch =
        search.length === 0 ||
        template.name.toLowerCase().includes(search) ||
        template.description.toLowerCase().includes(search) ||
        template.tag.toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [templateFilter, templateSearch]);

  const pageTitle = mode === "create" ? "Create Business Card" : "Edit Business Card";
  const pageDescription =
    mode === "create"
      ? "Choose a layout quickly, customize the visual style, and publish a stronger online business card with less friction."
      : "Update the selected template, brand details, and contact channels from one stronger editing workflow without losing the current card data.";
  const submitLabel = mode === "create" ? "Generate Card" : "Save Changes";
  const helperStats = [
    {
      label: mode === "create" ? "Workflow" : "Editing",
      value: mode === "create" ? "Faster setup" : "Live update",
      icon: Wand2,
      tone: "text-cyan-300",
    },
    {
      label: "Visibility",
      value: form.isPublic ? "Public link on" : "Private mode",
      icon: ShieldCheck,
      tone: "text-emerald-300",
    },
    {
      label: "Template",
      value: activeTemplate.name,
      icon: Eye,
      tone: "text-violet-300",
    },
  ];

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSelectTemplate = (templateId: BusinessCardTemplateId) => {
    const template =
      businessCardTemplates.find((item) => item.id === templateId) ?? businessCardTemplates[0];

    setForm((current) => ({
      ...current,
      template: template.id,
      primaryColor: template.primaryColor,
      backgroundColor: template.backgroundColor,
      fontFamily: template.fontFamily,
    }));
  };

  const applyPalettePreset = (preset: (typeof palettePresets)[number]) => {
    setForm((current) => ({
      ...current,
      primaryColor: preset.primaryColor,
      backgroundColor: preset.backgroundColor,
      fontFamily: preset.fontFamily,
    }));
  };

  const resetTemplateDefaults = () => {
    setForm((current) => ({
      ...current,
      primaryColor: activeTemplate.primaryColor,
      backgroundColor: activeTemplate.backgroundColor,
      fontFamily: activeTemplate.fontFamily,
    }));
  };

  const generateQrPreview = async (publicUrl: string, color: string) => {
    try {
      const image = await QRCode.toDataURL(publicUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: color,
          light: "#ffffff",
        },
      });
      setQrImage(image);
    } catch {
      setQrImage("");
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please choose an image file for the logo.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField("avatarUrl", typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Missing name",
        description: "Please enter a name for the business card.",
        variant: "destructive",
      });
      return;
    }

    if (mode === "edit" && !cardId) {
      toast({
        title: "Missing card",
        description: "Unable to find the business card to update.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const endpoint =
        mode === "create" ? "/api/business-cards" : `/api/dashboard/business-cards/${cardId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.message ||
            (mode === "create"
              ? "Failed to create business card"
              : "Failed to update business card")
        );
      }

      const data = await response.json();

      if (mode === "create") {
        const publicUrl = data.businessCard.qr_code_url;
        setCreatedCard({
          id: data.businessCard.id,
          slug: data.businessCard.slug,
          publicUrl,
        });
        setCopiedLink(false);
        await generateQrPreview(publicUrl, form.primaryColor);
      } else {
        toast({
          title: "Updated",
          description: "Business card updated successfully.",
        });
        router.push("/dashboard/business-cards");
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : mode === "create"
              ? "Failed to create business card"
              : "Failed to update business card",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(168,85,247,0.18),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.68),_rgba(2,6,23,0.94))]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              {mode === "create" ? "Business card studio" : "Business card editor"}
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {pageTitle}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                {pageDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
                onClick={() => setStep(1)}
              >
                <LayoutTemplate className="mr-2 h-4 w-4" />
                {mode === "edit" ? "Change Template" : "Choose Template"}
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
                onClick={() => setStep(2)}
              >
                <Palette className="mr-2 h-4 w-4" />
                Edit content
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {helperStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20"
              >
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <stat.icon className={`h-4 w-4 ${stat.tone}`} />
                  {stat.label}
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {stat.label === "Template"
                    ? "Current selected card presentation"
                    : stat.label === "Visibility"
                      ? "Control public access before saving"
                      : "Move from template to launch with less friction"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <StepChip number={1} title="Choose Template" active={step === 1} done={step > 1} />
        <StepChip number={2} title="Add User Info" active={step === 2} done={false} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {step === 1 ? (
            <div className="space-y-6">
              <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
                <CardHeader>
                  <CardTitle className="text-white">Choose Template Faster</CardTitle>
                  <CardDescription>
                    Filter the library, compare layouts quickly, and continue with the selected template already configured.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Search templates..."
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        className="h-12 rounded-2xl border-white/10 bg-slate-950/40 pl-11 text-slate-100 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {templateFilters.map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setTemplateFilter(filter)}
                          className={clsx(
                            "rounded-full border px-4 py-2 text-sm transition",
                            templateFilter === filter
                              ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {visibleTemplates.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {visibleTemplates.map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => handleSelectTemplate(template.id)}
                          className={clsx(
                            "overflow-hidden rounded-[1.75rem] border p-3 text-left transition-all duration-300",
                            form.template === template.id
                              ? "border-cyan-300/20 bg-gradient-to-br from-cyan-400/12 via-blue-500/10 to-violet-500/12 shadow-xl shadow-slate-950/20"
                              : "border-white/10 bg-slate-950/35 hover:border-cyan-300/15 hover:bg-white/[0.05]"
                          )}
                        >
                          <BusinessCardTemplatePreview
                            templateId={template.id}
                            compact
                            data={{
                              ...form,
                              primaryColor: template.primaryColor,
                              backgroundColor: template.backgroundColor,
                              fontFamily: template.fontFamily,
                            }}
                          />
                          <div className="px-1 pb-1 pt-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-medium text-white">{template.name}</div>
                              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-300">
                                {template.category}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-400">{template.description}</p>
                            <div className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                              {template.tag}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-6 text-center text-slate-400">
                      No templates match your filter. Try another keyword or category.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
                <CardHeader>
                  <CardTitle className="text-white">Selected Template</CardTitle>
                  <CardDescription>
                    Your current selection is ready to edit with matching color and typography defaults.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200">
                      {activeTemplate.category}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                      {activeTemplate.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{activeTemplate.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-400">{activeTemplate.description}</p>
                  </div>
                  <BusinessCardTemplatePreview templateId={form.template} data={form} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {mode === "edit" && (
                <Card className="border-cyan-300/15 bg-cyan-300/8 shadow-xl shadow-slate-950/20">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Change template without losing data</div>
                      <p className="mt-1 text-sm text-slate-300">
                        Your current name, logo, contact info, and social links stay intact when you switch to another template.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                      onClick={() => setStep(1)}
                    >
                      <LayoutTemplate className="mr-2 h-4 w-4" />
                      Choose Another Template
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
                <CardHeader>
                  <CardTitle className="text-white">Step 2: Add User Info</CardTitle>
                  <CardDescription>
                    This content is shown on the public card and used for the generated QR link.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-200">Logo</Label>
                    <div className="grid gap-4 md:grid-cols-[132px_1fr]">
                      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/40">
                        {form.avatarUrl ? (
                          <img src={form.avatarUrl} alt="Business logo preview" className="h-full w-full object-cover" />
                        ) : (
                          <span className="px-4 text-center text-xs text-slate-400">
                            Upload logo
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 file:text-slate-100"
                        />
                        <Input
                          placeholder="Or paste a logo image URL"
                          value={form.avatarUrl}
                          onChange={(e) => updateField("avatarUrl", e.target.value)}
                          className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400"
                        />
                        <p className="text-xs text-slate-400">
                          The logo appears on the selected business card template.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name" className="text-slate-200">Business / Person Name</Label>
                    <Input
                      id="name"
                      placeholder="Your Business Name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-200">Tagline / Title</Label>
                    <Input
                      id="title"
                      placeholder="#1 Platform For Digital Business"
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-slate-200">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your Company"
                      value={form.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio" className="text-slate-200">Short Description</Label>
                    <textarea
                      id="bio"
                      className="flex min-h-[140px] w-full rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2"
                      placeholder="Brief description of your business comes here..."
                      value={form.bio}
                      onChange={(e) => updateField("bio", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-200">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="9518311798"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@yoursite.com"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-slate-200">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://www.yoursite.com"
                      value={form.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-200">Address</Label>
                    <Input
                      id="address"
                      placeholder="12/34, Area, City - 456789"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="googleMaps" className="flex items-center gap-2 text-slate-200">
                      <MapPin className="h-4 w-4 text-cyan-300" />
                      Google Maps Link
                    </Label>
                    <Input
                      id="googleMaps"
                      placeholder="https://maps.google.com/..."
                      value={form.googleMaps}
                      onChange={(e) => updateField("googleMaps", e.target.value)}
                      className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400">
                      Paste your Google Maps location URL so visitors can open directions directly.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
                <CardHeader>
                  <CardTitle className="text-white">Social Links</CardTitle>
                  <CardDescription>
                    Add the channels you want visitors to tap directly from your digital business card.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {socialFields.map((field) => (
                    <SocialField
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      placeholder={field.placeholder}
                      value={form[field.id]}
                      onChange={(value) => updateField(field.id, value)}
                      icon={field.icon}
                      badge={field.badge}
                    />
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <SlidersHorizontal className="h-5 w-5 text-cyan-300" />
                Template Editor
              </CardTitle>
              <CardDescription>
                Quickly switch templates, apply design presets, and fine-tune colors and typography.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Quick Template Switch</Label>
                  <Button
                    variant="ghost"
                    className="h-8 rounded-full px-3 text-slate-300 hover:bg-white/5 hover:text-white"
                    onClick={resetTemplateDefaults}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Style
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {businessCardTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleSelectTemplate(template.id)}
                      className={clsx(
                        "rounded-2xl border px-3 py-3 text-left transition",
                        form.template === template.id
                          ? "border-cyan-300/20 bg-cyan-300/10 text-white"
                          : "border-white/10 bg-slate-950/35 text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                        {template.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-slate-200">
                  <SwatchBook className="h-4 w-4 text-emerald-300" />
                  Palette Presets
                </Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {palettePresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPalettePreset(preset)}
                      className="rounded-2xl border border-white/10 bg-slate-950/35 p-3 text-left transition hover:bg-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: preset.primaryColor }} />
                        <span
                          className="h-4 w-4 rounded-full border border-white/10"
                          style={{ backgroundColor: preset.backgroundColor }}
                        />
                        <span className="text-sm font-medium text-white">{preset.name}</span>
                      </div>
                      <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                        {preset.fontFamily}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                <Label className="flex items-center gap-2 text-slate-200">
                  <Palette className="h-4 w-4 text-violet-300" />
                  Manual Styling
                </Label>
                <div className="space-y-2">
                  <Label className="text-slate-400">Primary Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    className="h-12 w-16 rounded-2xl border border-white/10 bg-slate-950/40"
                  />
                  <Input
                    value={form.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.backgroundColor}
                    onChange={(e) => updateField("backgroundColor", e.target.value)}
                    className="h-12 w-16 rounded-2xl border border-white/10 bg-slate-950/40"
                  />
                  <Input
                    value={form.backgroundColor}
                    onChange={(e) => updateField("backgroundColor", e.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100"
                  />
                </div>
              </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Font Family</Label>
                  <Select value={form.fontFamily} onValueChange={(value) => updateField("fontFamily", value)}>
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900/95 text-slate-100">
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Preview Size</Label>
                  <Select value={previewMode} onValueChange={(value) => setPreviewMode(value as PreviewMode)}>
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900/95 text-slate-100">
                      <SelectItem value="full">Full Preview</SelectItem>
                      <SelectItem value="compact">Compact Preview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-200">Status</Label>
                <select
                  id="status"
                  className="flex h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100"
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => updateField("isPublic", e.target.checked)}
                />
                <div>
                  <div className="text-sm font-medium text-white">Public card</div>
                  <div className="text-xs text-slate-400">
                    Allow the business card to be visible from its generated link.
                  </div>
                </div>
              </label>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
            <CardHeader>
              <CardTitle className="text-white">Live Preview</CardTitle>
              <CardDescription>
                This is how the selected design will look when visitors open the card.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessCardTemplatePreview
                templateId={form.template}
                data={form}
                compact={previewMode === "compact"}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
              onClick={() => {
                if (step === 1) {
                  router.push("/dashboard/business-cards");
                  return;
                }

                setStep(1);
              }}
            >
              {step === 1 ? (
                "Cancel"
              ) : (
                <>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {mode === "edit" ? "Change Template" : "Back To Templates"}
                </>
              )}
            </Button>
            {step === 1 ? (
              <Button
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white"
                onClick={() => setStep(2)}
              >
                Continue To Info
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white"
                onClick={handleSave}
                loading={isSaving}
              >
                {submitLabel}
              </Button>
            )}
          </div>

          {step === 2 && (
            <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Tips</CardTitle>
                <CardDescription>
                  Add only the links you want to show. Saved links become clickable actions on the public card.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-3">
                  <Globe className="h-4 w-4 text-cyan-300" />
                  Use full URLs for websites and social profiles when possible.
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-3">
                  <MapPin className="h-4 w-4 text-rose-300" />
                  Paste the full Google Maps share link to let visitors open your location quickly.
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-3">
                  <MessageCircle className="h-4 w-4 text-emerald-300" />
                  WhatsApp and Telegram can also work with phone numbers or usernames.
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-3">
                  <Wand2 className="h-4 w-4 text-violet-300" />
                  Use a palette preset first, then fine-tune the colors if you want a custom look.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {mode === "create" && createdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-violet-300">Business Card Ready</p>
                <h2 className="mt-3 text-2xl font-semibold">Generate QR Code For Your Link</h2>
                <p className="mt-2 text-sm text-white/65">
                  Your online business card is live. Share the public link or download the QR code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreatedCard(null)}
                className="rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-white/50">Public Link</div>
              <div className="mt-3 break-all text-sm text-white/90">{createdCard.publicUrl}</div>
            </div>

            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
              <div className="mx-auto rounded-3xl bg-white p-4 shadow-xl">
                {qrImage ? (
                  <img src={qrImage} alt="Business card QR code" className="h-56 w-56 rounded-2xl" />
                ) : (
                  <div className="flex h-56 w-56 items-center justify-center text-sm text-slate-500">
                    Generating QR...
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <Button
                  className="w-full"
                  onClick={async () => {
                    await navigator.clipboard.writeText(createdCard.publicUrl);
                    setCopiedLink(true);
                    window.setTimeout(() => setCopiedLink(false), 1800);
                  }}
                >
                  {copiedLink ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copiedLink ? "Copied Link" : "Copy Public Link"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  onClick={() => window.open(createdCard.publicUrl, "_blank")}
                >
                  Open Public Card
                </Button>
                {qrImage && (
                  <a
                    href={qrImage}
                    download={`${createdCard.slug}-qr.png`}
                    className="flex w-full items-center justify-center rounded-md border border-white/15 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download QR PNG
                  </a>
                )}
                <Button
                  variant="outline"
                  className="w-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    setCreatedCard(null);
                    router.push("/dashboard/business-cards");
                    router.refresh();
                  }}
                >
                  Back To Business Cards
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
