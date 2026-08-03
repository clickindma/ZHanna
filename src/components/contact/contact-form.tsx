"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BRAND } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Please add a short subject"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="mt-1.5 text-xs text-destructive">{message}</p>;
}

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: ContactValues) {
    const mailto = `mailto:${BRAND.email}?subject=${encodeURIComponent(
      `${values.subject} — ${values.name}`
    )}&body=${encodeURIComponent(
      `${values.message}\n\n—\n${values.name}\n${values.email}`
    )}`;

    window.location.href = mailto;
    setSent(true);
    reset();
    toast.success("Thank you — your message is ready to send.");
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-champagne-deep bg-champagne/30 px-6 py-16 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.6} />
        </span>
        <p className="mt-5 font-playfair text-2xl text-navy">
          Thank you for reaching out
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Your message has been prepared in your email client. Our client care
          team responds within one business day at {BRAND.email}.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setSent(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-champagne-deep bg-background p-6 shadow-[0_20px_60px_-30px_rgba(11,27,51,0.25)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Full name</Label>
          <Input
            id="contact-name"
            placeholder="Ananya Sharma"
            aria-invalid={Boolean(errors.name)}
            className="mt-2"
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="contact-email">Email address</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className="mt-2"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          placeholder="Order question, custom order, collaboration…"
          aria-invalid={Boolean(errors.subject)}
          className="mt-2"
          {...register("subject")}
        />
        <FieldError message={errors.subject?.message} />
      </div>

      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={6}
          placeholder="Tell us how we can help…"
          aria-invalid={Boolean(errors.message)}
          className="mt-2 resize-none"
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Send message"
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Prefer email? Write to us directly at{" "}
        <a
          href={`mailto:${BRAND.email}`}
          className="font-medium text-gold-dark transition-colors hover:text-gold"
        >
          {BRAND.email}
        </a>
      </p>
    </form>
  );
}
