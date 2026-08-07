import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword } from "@/lib/auth";
import { sendEmail, getWelcomeEmailHtml } from "@/lib/resend";

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
          const name = credentials.name || credentials.email.split("@")[0];
          
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              name,
              passwordHash: hashedPassword,
              role: "CUSTOMER",
            }
          });
          
          // Send Welcome Email
          await sendEmail({
            to: user.email!,
            subject: "Welcome to The Raw House",
            html: getWelcomeEmailHtml(name),
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
    maxAge: 30 * 60, // 30 minutes session expiry
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
  },
  events: {
    async createUser({ user }) {
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: "Welcome to The Raw House",
          html: getWelcomeEmailHtml(user.name || "Client"),
        });
      }
    }
  }
});

export { handler as GET, handler as POST };
