import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }
        // Return the minimal user object; include role for callbacks
        return { id: user.id.toString(), email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    // Attach user.role to the JWT token on sign in
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    // Expose role in session.user
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    // Redirect users to their role-based route after login
    // async redirect({ url, baseUrl, token }) {
    //   if (token && token.role) {
    //     return `${baseUrl}/roles/${token.role}`;
    //   }
    //   return baseUrl;
    // },
  },
  pages: {
    signIn: "/", // our login page lives at "/"
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};