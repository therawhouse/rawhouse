import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword } from "@/lib/auth";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isRegister: { label: "Is Register", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const isRegister = credentials.isRegister === "true";

        if (isRegister) {
          const existing = await prisma.user.findUnique({ 
            where: { email: credentials.email } 
          });
          
          if (existing) {
            throw new Error("User already exists");
          }
          
          const hashedPassword = await hashPassword(credentials.password);
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name || credentials.email.split("@")[0],
              passwordHash: hashedPassword,
              role: "CUSTOMER",
            }
          });
          
          return user;
        } else {
          // Login
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (!user || !user.passwordHash) {
            throw new Error("Invalid credentials");
          }
          
          const isValid = await comparePassword(credentials.password, user.passwordHash);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }
          
          return user;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/", // We use the modal on the home page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
