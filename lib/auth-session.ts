import { auth } from "@/auth";

type AppSession = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  expires: string;
};

export async function getAppSession(): Promise<AppSession | null> {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  return {
    user: {
      id: (session.user as any).id ?? "",
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
    expires: session.expires ?? "",
  };
}
