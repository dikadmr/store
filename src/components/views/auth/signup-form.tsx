/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authServices } from "@/services/auth";
import Image from "next/image";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { push } = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
    };
    console.log(data);

    const result = await authServices.registerAccount(data);

    if (result.status === 200) {
      form.reset();
      setIsLoading(false);
      push("/auth/login");
    } else {
      setIsLoading(false);
      setError("Email already registered");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Image
              src="/images/logo_labani.png"
              alt="Labani Media Nusantara Logo"
              width={44}
              height={44}
            />
            <h1 className="text-xl font-bold">Labani Media Nusantara</h1>
            <FieldDescription>
              Already have an account? <a href="/auth/login">Login</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <FieldLabel>Full Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="place your name"
              required
            />
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="place your phone"
              required
            />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="place your password"
              required
            />
          </Field>
          <Field>
            <FieldDescription>
              {error && <p className="text-destructive text-center">{error}</p>}
            </FieldDescription>
            <Button type="submit">
              {isLoading ? "Loading..." : "Create Account"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
