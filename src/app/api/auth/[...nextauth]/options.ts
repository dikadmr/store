import { loginWithGoogle, signIn } from "@/services/auth/service";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await signIn(email);
        if (user && typeof user.password === "string") {
          const passwordConfirm = await compare(password, user.password);
          if (passwordConfirm) {
            return {
              id: (user.id as string) || "",
              name: (user.name as string) || "",
              email: (user.email as string) || "",
              phone: (user.phone as string) || "",
              role: (user.role as string) || "client",
              created_at: user.created_at ? String(user.created_at) : undefined,
            };
          }
          return null;
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || ``,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || ``,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "credentials" && user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
        token.role = user.role;
        token.created_at = user.created_at;
      }

      if (account?.provider === "google" && user) {
        const data = {
          name: user.name || "",
          email: user.email || "",
          type: "google",
        };

        await loginWithGoogle(data, (googleUser) => {
          token.id = (googleUser.id as string) || "";
          token.email = googleUser.email;
          token.name = googleUser.name;
          token.role = (googleUser.role as string) || "member";
          token.created_at = googleUser.created_at
            ? String(googleUser.created_at)
            : undefined;
        });
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id;
        }
        if (token.email) {
          session.user.email = token.email;
        }
        if (token.name) {
          session.user.name = token.name;
        }
        if (token.phone) {
          session.user.phone = token.phone;
        }
        if (token.role) {
          session.user.role = token.role;
        }
        if (token.created_at) {
          session.user.created_at = token.created_at;
        }
      }

      const accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || ``, {
        algorithm: "HS256",
      });

      session.accessToken = accessToken;

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
