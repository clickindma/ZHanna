"use client";

import Link from "next/link";
import { useState } from "react";
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
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

function safeNextPath(value?: string | null): string | null {
  if (!value) {
    return null;
  }
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("://")
  ) {
    return null;
  }
  return value;
}

export function LoginForm({ next }: { next?: string | null }) {
  const { update } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password. Please try again.");
      return;
    }

    const session = await update();

    const destination =
      safeNextPath(next) ??
      (session?.user?.role === "admin" ? "/admin" : "/");

    toast.success(
      session?.user?.name
        ? `Welcome back, ${session.user.name.split(" ")[0]}`
        : "Welcome back to Zhanna"
    );

    // Full page navigation (not client-side router.push) so the server
    // re-renders with the fresh session cookie — guarantees admin guards
    // and layouts evaluate against the newly authenticated session.
    window.location.assign(destination);
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
        label="Email address"
        id="login-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        label="Password"
        id="login-password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-lg bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-sm font-semibold tracking-[0.18em] text-navy-deep uppercase hover:brightness-110 disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-xs text-white/40">
        Forgot your password?{" "}
        <Link href="/contact" className="text-gold transition-colors hover:text-gold-light">
          Contact care
        </Link>
      </p>

      <div className="flex items-center gap-3 pt-1">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/35">
          New to Zhanna
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <Button
        render={<Link href="/register" />}
        type="button"
        variant="outline"
        className="h-12 w-full rounded-lg border-white/20 bg-transparent text-sm tracking-[0.18em] text-white uppercase hover:border-gold hover:bg-white/5 hover:text-gold"
      >
        Create an account
      </Button>
    </form>
  );
}
