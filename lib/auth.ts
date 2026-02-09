import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireRole(
  allowedRoles: Array<"ADMIN" | "EDITOR">
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !allowedRoles.includes((session.user as any).role)) {
    throw new Error("Unauthorized");
  }

  return session;
}
