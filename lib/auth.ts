import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;
        if (!user.active) throw new Error("Your account has been deactivated. Contact an administrator.");

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          allowedApps: user.allowedApps,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.allowedApps = (user as { allowedApps?: string | null }).allowedApps;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.sub;
        session.user.allowedApps = token.allowedApps as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
