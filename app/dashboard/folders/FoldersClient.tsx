"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Eye,
  FolderGit2,
  FolderOpen,
  Layers3,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Folder as FolderIcon,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Folder } from "@/types/models";

interface FolderWithCount extends Folder {
  qrCount: number;
}

interface FoldersClientProps {
  initialFolders: FolderWithCount[];
}

export default function FoldersClient({ initialFolders }: FoldersClientProps) {
  const { toast } = useToast();
  const [folders, setFolders] = useState<FolderWithCount[]>(initialFolders);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const totalQRCodes = folders.reduce((sum, folder) => sum + (folder.qrCount ?? 0), 0);

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({ title: "Error", description: "Folder name is required", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch("/api/dashboard/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const data = await res.json();
      setFolders((prev) => [data.folder, ...prev]);
      toast({ title: "Success", description: `Folder "${newFolderName}" created successfully` });
      setNewFolderName("");
      setShowCreateDialog(false);
    } catch {
      toast({ title: "Error", description: "Failed to create folder", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/folders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setFolders((prev) => prev.filter((f) => f.id !== id));
      toast({ title: "Deleted", description: "Folder deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete folder", variant: "destructive" });
    }
  };

  const getColorClasses = (color: string | null) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      red: "bg-red-500",
      pink: "bg-pink-500",
    };
    return colors[color ?? ""] || colors.blue;
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(168,85,247,0.18),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.68),_rgba(2,6,23,0.94))]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Workspace organization
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Keep every QR campaign clean, grouped, and easy to manage.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Build a sharper operating layer for your QR library with curated folder
                groupings, faster access, and clearer organization at scale.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="h-12 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 text-white shadow-xl shadow-blue-950/30 hover:-translate-y-0.5"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Folder
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <FolderGit2 className="h-4 w-4 text-cyan-300" />
                Total folders
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{folders.length}</p>
              <p className="mt-1 text-sm text-slate-400">Collections available across your workspace</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Layers3 className="h-4 w-4 text-emerald-300" />
                Contained codes
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{totalQRCodes}</p>
              <p className="mt-1 text-sm text-slate-400">QR codes already assigned to folders</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Eye className="h-4 w-4 text-violet-300" />
                Search results
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{filteredFolders.length}</p>
              <p className="mt-1 text-sm text-slate-400">Folders matching the current filter</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search folders..."
              className="h-12 rounded-2xl border-white/10 bg-slate-950/40 pl-11 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-400/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredFolders.map((folder) => (
          <Card
            key={folder.id}
            className="group cursor-pointer overflow-hidden border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/15 hover:bg-white/[0.06]"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${getColorClasses(folder.color)} shadow-lg shadow-slate-950/20 ring-1 ring-white/10`}
                  >
                    <FolderIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-white">{folder.name}</CardTitle>
                    <p className="text-xs text-slate-400">
                      {new Date(folder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/10 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-44 rounded-2xl border-white/10 bg-slate-900/95 text-slate-100 backdrop-blur-xl"
                  >
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(folder.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center justify-between">
                  <Badge className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/5">
                  {folder.qrCount ?? 0} QR codes
                </Badge>
                  <FolderOpen className="h-4 w-4 text-cyan-300" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Collection</span>
                  <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFolders.length === 0 && (
        <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-200">
                <FolderIcon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No folders found</h3>
              <p className="mb-6 text-slate-400">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Get started by creating your first folder"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Folder
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-white/10 bg-slate-950 text-white shadow-2xl shadow-black/40">
            <CardHeader>
              <CardTitle>Create New Folder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Folder Name</label>
                <Input
                  placeholder="Enter folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-400"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                  onClick={() => { setShowCreateDialog(false); setNewFolderName(""); }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateFolder}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white"
                >
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
