import { retrieveDataByFields, addData } from "@/lib/firebase/service";
import bcrypt from "bcrypt";

export interface GoogleAuthUser {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  created_at?: string | Date;
  [key: string]: unknown;
}

export async function signUp(userData: {
  email: string;
  name: string;
  phone: string;
  password: string;
  role?: string;
  created_at?: string | Date;
  updated_at?: Date;
}): Promise<boolean> {
  const data = await retrieveDataByFields("users", "email", userData.email);

  if (data.length > 0) return false;

  if (!userData.role) userData.role = "client";
  userData.password = await bcrypt.hash(userData.password, 10);
  userData.created_at = new Date();
  userData.updated_at = new Date();

  return new Promise((resolve) => {
    addData("users", userData);
  });
}

export async function signIn(
  email: string,
): Promise<Record<string, unknown> | null> {
  const data = await retrieveDataByFields("users", "email", email);

  if (data && data.length > 0) {
    return data[0];
  } else {
    return null;
  }
}

export async function loginWithGoogle(
  data: {
    email: string;
    name: string;
    type: string;
    role?: string;
    created_at?: string | Date;
    updated_at?: Date;
    password?: string;
  },
  callbacks: (user: GoogleAuthUser) => void,
) {
  const user = await retrieveDataByFields("users", "email", data.email);

  if (user.length > 0) {
    callbacks(user[0] as GoogleAuthUser);
  } else {
    data.role = "member";
    data.created_at = new Date();
    data.updated_at = new Date();
    data.password = "";

    await addData("users", data);
  }
}
