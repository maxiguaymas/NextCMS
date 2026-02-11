import { getServerSession, type NextAuthOptions, type DefaultSession, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EDITOR" | "VIEWER";
    } & DefaultSession["user"];
  }
  interface User {
    role: "ADMIN" | "EDITOR" | "VIEWER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "EDITOR" | "VIEWER";
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        if (!user.emailVerified) {
          throw new Error("Por favor, verifica tu correo electrónico antes de entrar.");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as User).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: "/login" },
};

export async function requireRole(
  allowedRoles: Array<"ADMIN" | "EDITOR">
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !allowedRoles.includes(session.user.role as "ADMIN" | "EDITOR")) {
    throw new Error("Unauthorized");
  }

  return session;
}
