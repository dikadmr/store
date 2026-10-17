import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      created_at?: string;
      phone?: string;
      role?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    created_at?: string;
    phone?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    created_at?: string;
    phone?: string;
    role?: string;
  }
}
