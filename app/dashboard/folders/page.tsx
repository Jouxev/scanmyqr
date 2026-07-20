import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth-session";
import { getFolders } from "@/lib/dashboard-data";
import FoldersClient from "./FoldersClient";

export default async function FoldersPage() {
  const session = await getAppSession();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const folders = await getFolders(userId);
  const initialFolders = folders.map((folder) => ({
    ...folder,
    qrCount: folder.qrCount ?? 0,
  }));

  return <FoldersClient initialFolders={initialFolders} />;
}

