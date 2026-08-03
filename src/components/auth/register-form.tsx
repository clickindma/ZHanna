"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AuthField,
  PasswordField,
} from "@/components/auth/auth-field";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();
  const { update } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    setServerError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    });

    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    if (!response.ok) {
      setServerError(data?.message ?? "Something went wrong. Please try again.");
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInResult?.error) {
      toast.success("Account created. Please sign in.");
      router.push("/login");
      return;
    }

    const session = await update();
    router.refresh();
    toast.success(
      session?.user?.name
        ? `Welcome to Zhanna, ${session.user.name.split(" ")[0]}`
        : "Welcome to Zhanna"
    );
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-[13px] leading-relaxed text-red-200"
        >
          {serverError}
        </div>
      )}

      <AuthField
        label="Full name"
        id="register-name"
        type="text"
        autoComplete="name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register("name")}
      />

      <AuthField
        label="Email address"
        id="register-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        label="Password"
        id="register-password"
        autoComplete="new-password"
        placeholder="At least 8 characters, letters & numbers"
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordField
        label="Confirm password"
        id="register-confirm"
        autoComplete="new-password"
        placeholder="Repeat your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-lg bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-sm font-semibold tracking-[0.18em] text-navy-deep uppercase hover:brightness-110 disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="pt-1 text-center text-xs leading-relaxed text-white/40">
        By creating an account you agree to our{" "}
        <Link
          href="/terms"
          className="text-white/70 underline-offset-4 transition-colors hover:text-gold hover:underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="text-white/70 underline-offset-4 transition-colors hover:text-gold hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <div className="flex items-center gap-3 pt-1">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/35">
          Already a member
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <Button
        render={<Link href="/login" />}
        type="button"
        variant="outline"
        className="h-12 w-full rounded-lg border-white/20 bg-transparent text-sm tracking-[0.18em] text-white uppercase hover:border-gold hover:bg-white/5 hover:text-gold"
      >
        Sign in instead
      </Button>
    </form>
  );
}
