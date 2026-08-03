"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const inputClasses =
  "h-11 rounded-lg border-white/15 bg-white/[0.06] px-3.5 text-[15px] text-white placeholder:text-white/35 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25 aria-invalid:border-red-400/70 aria-invalid:ring-red-400/20";

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="mt-1.5 text-xs text-red-300">{message}</p>;
}

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthField({
  label,
  error,
  id,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60"
      >
        {label}
      </Label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(inputClasses, className)}
        {...props}
      />
      <FieldError message={error} />
    </div>
  );
}

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function PasswordField({
  label,
  error,
  id,
  className,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Label
        htmlFor={id}
        className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60"
      >
        {label}
      </Label>
      <div className="relative mt-2">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          className={cn(inputClasses, "pr-11", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-white/40 transition-colors hover:text-gold"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      <FieldError message={error} />
    </div>
  );
}
