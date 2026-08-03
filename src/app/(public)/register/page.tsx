import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your Zhanna account for a personal shopping experience, order tracking and more.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      eyebrow="Join Zhanna"
      title={
        <>
          Begin your <span className="text-gradient-gold italic">story</span>
        </>
      }
      subtitle="Create an account to enjoy a seamless shopping experience, order tracking and members-only updates."
      footer={
        <>
          Already a member?{" "}
          <a
            href="/login"
            className="font-medium text-gold transition-colors hover:text-gold-light"
          >
            Sign in
          </a>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
