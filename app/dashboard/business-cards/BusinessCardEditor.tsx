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
  Github,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Play,
  Send,
  Twitter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
        active
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
          : "border-border bg-background/60"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
          active || done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-4 w-4" /> : number}
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Step {number}</div>
        <div className="text-sm font-medium">{title}</div>
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
      <Label htmlFor={id} className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground">
          {icon || <span className="text-[10px] font-bold uppercase">{badge}</span>}
        </span>
        <span>{label}</span>
      </Label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/80">
            {icon || <span className="text-[10px] font-bold uppercase">{badge}</span>}
          </span>
        </div>
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-14"
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

  const pageTitle = mode === "create" ? "Create Business Card" : "Edit Business Card";
  const pageDescription =
    mode === "create"
      ? "Follow the steps to choose a design, add your information, and generate a live online card."
      : "Update the template, profile details, and social links for this business card.";
  const submitLabel = mode === "create" ? "Generate Card" : "Save Changes";

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
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <p className="mt-1 text-muted-foreground">{pageDescription}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <StepChip number={1} title="Choose Template" active={step === 1} done={step > 1} />
        <StepChip number={2} title="Add User Info" active={step === 2} done={false} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {step === 1 ? (
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Choose Template</CardTitle>
                <CardDescription>
                  Pick the card style first. The next step will use this template for live preview and final output.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-3">
                {businessCardTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`rounded-3xl border p-3 text-left transition-all ${
                      form.template === template.id
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
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
                    <div className="px-2 pb-2 pt-3">
                      <div className="font-medium">{template.name}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Add User Info</CardTitle>
                  <CardDescription>
                    This content is shown on the public card and used for the generated QR link.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Logo</Label>
                    <div className="grid gap-4 md:grid-cols-[132px_1fr]">
                      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/20">
                        {form.avatarUrl ? (
                          <img src={form.avatarUrl} alt="Business logo preview" className="h-full w-full object-cover" />
                        ) : (
                          <span className="px-4 text-center text-xs text-muted-foreground">
                            Upload logo
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Input type="file" accept="image/*" onChange={handleLogoUpload} />
                        <Input
                          placeholder="Or paste a logo image URL"
                          value={form.avatarUrl}
                          onChange={(e) => updateField("avatarUrl", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          The logo appears on the selected business card template.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Business / Person Name</Label>
                    <Input
                      id="name"
                      placeholder="Your Business Name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Tagline / Title</Label>
                    <Input
                      id="title"
                      placeholder="#1 Platform For Digital Business"
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your Company"
                      value={form.company}
                      onChange={(e) => updateField("company", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Short Description</Label>
                    <textarea
                      id="bio"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Brief description of your business comes here..."
                      value={form.bio}
                      onChange={(e) => updateField("bio", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="9518311798"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@yoursite.com"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://www.yoursite.com"
                      value={form.website}
                      onChange={(e) => updateField("website", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="12/34, Area, City - 456789"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>
                    Add the channels you want visitors to tap directly from your digital business card.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <SocialField
                    id="facebook"
                    label="Facebook"
                    placeholder="https://facebook.com/..."
                    value={form.facebook}
                    onChange={(value) => updateField("facebook", value)}
                    badge="f"
                  />
                  <SocialField
                    id="linkedin"
                    label="LinkedIn"
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedin}
                    onChange={(value) => updateField("linkedin", value)}
                    icon={<Linkedin className="h-4 w-4" />}
                  />
                  <SocialField
                    id="twitter"
                    label="Twitter / X"
                    placeholder="https://x.com/..."
                    value={form.twitter}
                    onChange={(value) => updateField("twitter", value)}
                    icon={<Twitter className="h-4 w-4" />}
                  />
                  <SocialField
                    id="instagram"
                    label="Instagram"
                    placeholder="https://instagram.com/..."
                    value={form.instagram}
                    onChange={(value) => updateField("instagram", value)}
                    icon={<Instagram className="h-4 w-4" />}
                  />
                  <SocialField
                    id="tiktok"
                    label="TikTok"
                    placeholder="https://tiktok.com/@..."
                    value={form.tiktok}
                    onChange={(value) => updateField("tiktok", value)}
                    badge="tt"
                  />
                  <SocialField
                    id="github"
                    label="GitHub"
                    placeholder="https://github.com/..."
                    value={form.github}
                    onChange={(value) => updateField("github", value)}
                    icon={<Github className="h-4 w-4" />}
                  />
                  <SocialField
                    id="snapchat"
                    label="Snapchat"
                    placeholder="@yourhandle"
                    value={form.snapchat}
                    onChange={(value) => updateField("snapchat", value)}
                    badge="sc"
                  />
                  <SocialField
                    id="whatsapp"
                    label="WhatsApp"
                    placeholder="+213..."
                    value={form.whatsapp}
                    onChange={(value) => updateField("whatsapp", value)}
                    icon={<MessageCircle className="h-4 w-4" />}
                  />
                  <SocialField
                    id="telegram"
                    label="Telegram"
                    placeholder="@username"
                    value={form.telegram}
                    onChange={(value) => updateField("telegram", value)}
                    icon={<Send className="h-4 w-4" />}
                  />
                  <SocialField
                    id="viber"
                    label="Viber"
                    placeholder="+213..."
                    value={form.viber}
                    onChange={(value) => updateField("viber", value)}
                    badge="vb"
                  />
                  <SocialField
                    id="youtube"
                    label="YouTube"
                    placeholder="https://youtube.com/@..."
                    value={form.youtube}
                    onChange={(value) => updateField("youtube", value)}
                    icon={<Play className="h-4 w-4" />}
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Controls</CardTitle>
              <CardDescription>
                Adjust colors, publish state, and visibility before saving.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    className="h-10 w-16 rounded border"
                  />
                  <Input
                    value={form.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.backgroundColor}
                    onChange={(e) => updateField("backgroundColor", e.target.value)}
                    className="h-10 w-16 rounded border"
                  />
                  <Input
                    value={form.backgroundColor}
                    onChange={(e) => updateField("backgroundColor", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-lg border border-border p-3">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => updateField("isPublic", e.target.checked)}
                />
                <div>
                  <div className="text-sm font-medium">Public card</div>
                  <div className="text-xs text-muted-foreground">
                    Allow the business card to be visible from its generated link.
                  </div>
                </div>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                This is how the selected design will look when visitors open the card.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessCardTemplatePreview templateId={form.template} data={form} />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
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
                  Back To Templates
                </>
              )}
            </Button>
            {step === 1 ? (
              <Button className="flex-1" onClick={() => setStep(2)}>
                Continue To Info
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="flex-1" onClick={handleSave} loading={isSaving}>
                {submitLabel}
              </Button>
            )}
          </div>

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
                <CardDescription>
                  Add only the links you want to show. Saved links become clickable actions on the public card.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Use full URLs for websites and social profiles when possible.
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  WhatsApp and Telegram can also work with phone numbers or usernames.
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
