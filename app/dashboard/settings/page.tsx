"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  User,
  Mail,
  Lock,
  Bell,
  Palette,
  Shield,
  Download,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    company: "Acme Inc",
    website: "https://acme.com",
    bio: "Product designer and entrepreneur",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    scanAlerts: false,
    marketing: false,
  });

  const [appearance, setAppearance] = useState({
    theme: "system",
    fontSize: "medium",
  });
  const inputClass =
    "h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-400/60";

  const handleSaveProfile = () => {
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Success",
      description: "Notification settings updated",
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(168,85,247,0.18),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.68),_rgba(2,6,23,0.94))]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Account control center
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Manage your account settings and workspace preferences from one premium panel.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Update your identity, security posture, notifications, and experience settings
                without leaving the same polished environment used across the dashboard.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <User className="h-4 w-4 text-cyan-300" />
                Profile state
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">Complete</p>
              <p className="mt-1 text-sm text-slate-400">Core identity and contact data are available</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Shield className="h-4 w-4 text-emerald-300" />
                Security
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">Protected</p>
              <p className="mt-1 text-sm text-slate-400">Password controls and 2FA entry point are ready</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Activity className="h-4 w-4 text-violet-300" />
                Preferences
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">Synced</p>
              <p className="mt-1 text-sm text-slate-400">Notification and appearance settings are editable</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5 text-cyan-300" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your profile information and public details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6 rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
            <Avatar className="h-20 w-20 ring-2 ring-white/10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
              >
                Change Avatar
              </Button>
              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-200">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-200">Company</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) =>
                  setProfile({ ...profile, company: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website" className="text-slate-200">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) =>
                  setProfile({ ...profile, website: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio" className="text-slate-200">Bio</Label>
              <textarea
                id="bio"
                className="flex min-h-[120px] w-full rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="h-5 w-5 text-emerald-300" />
            Password
          </CardTitle>
          <CardDescription>
            Change your password or enable two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-slate-200">Current Password</Label>
              <Input id="current-password" type="password" className={inputClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-slate-200">New Password</Label>
              <Input id="new-password" type="password" className={inputClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-slate-200">Confirm New Password</Label>
              <Input id="confirm-password" type="password" className={inputClass} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-300" />
              <span className="text-sm text-slate-200">Two-factor authentication</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
            >
              Enable
            </Button>
          </div>
          <div className="flex justify-end">
            <Button className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-white">
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="h-5 w-5 text-violet-300" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-cyan-300" />
              <div>
                <div className="text-sm font-medium text-white">Email Notifications</div>
                <div className="text-xs text-slate-400">
                  Receive email updates
                </div>
              </div>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked })
              }
            />
          </div>
          <Separator className="bg-white/10" />
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-violet-300" />
              <div>
                <div className="text-sm font-medium text-white">Push Notifications</div>
                <div className="text-xs text-slate-400">
                  Receive push notifications
                </div>
              </div>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, push: checked })
              }
            />
          </div>
          <Separator className="bg-white/10" />
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
            <div>
              <div className="text-sm font-medium text-white">Scan Alerts</div>
              <div className="text-xs text-slate-400">
                Get notified when your QR codes are scanned
              </div>
            </div>
            <Switch
              checked={notifications.scanAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, scanAlerts: checked })
              }
            />
          </div>
          <Separator className="bg-white/10" />
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
            <div>
              <div className="text-sm font-medium text-white">Marketing</div>
              <div className="text-xs text-slate-400">
                Receive marketing emails
              </div>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, marketing: checked })
              }
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveNotifications}
              className="rounded-2xl bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-500 text-white"
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Palette className="h-5 w-5 text-orange-300" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-200">Theme</Label>
            <Select
              value={appearance.theme}
              onValueChange={(value) =>
                setAppearance({ ...appearance, theme: value })
              }
            >
              <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-slate-900 text-slate-100">
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-200">Font Size</Label>
            <Select
              value={appearance.fontSize}
              onValueChange={(value) =>
                setAppearance({ ...appearance, fontSize: value })
              }
            >
              <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-slate-900 text-slate-100">
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/30 bg-red-500/5 shadow-xl shadow-red-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
            <div>
              <div className="text-sm font-medium text-white">Export Data</div>
              <div className="text-xs text-slate-400">
                Download all your data in JSON format
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <Separator className="bg-white/10" />
          <div className="flex items-center justify-between rounded-[1.5rem] border border-red-500/20 bg-red-500/10 p-4">
            <div>
              <div className="text-sm font-medium text-white">Delete Account</div>
              <div className="text-xs text-slate-300">
                Permanently delete your account and all data
              </div>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
