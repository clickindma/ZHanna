import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Zhanna account to view your orders and manage your profile.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthLayout
      eyebrow="Client Login"
      title={
        <>
          Welcome <span className="text-gradient-gold italic">back</span>
        </>
      }
      subtitle="Sign in to continue your journey with Zhanna — your orders, wishlist and appointments await."
      footer={
        <>
          Not a member yet?{" "}
          <a
            href="/register"
            className="font-medium text-gold transition-colors hover:text-gold-light"
          >
            Create your account
          </a>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthLayout>
  );
}
