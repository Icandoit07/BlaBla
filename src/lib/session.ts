import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function requireUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const id = (session?.user as any)?.id as string | undefined;
  if (!id) throw new Error("unauthorized");
  return id;
}


