"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { WavyBackground } from "@/components/ui/wavy";

const EASE = [0.22, 1, 0.36, 1] as const;

export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <WavyBackground>
      <div className="w-full max-w-3xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-aqua">
            Join the circle
          </p>
          <h2 className="mt-3 font-playfair text-3xl font-semibold leading-tight text-snow sm:text-4xl lg:text-5xl">
            Stay informed with our
            <span className="block font-display italic text-aqua">
              latest news and updates
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-silver/85">
            New drops, private sales and styling stories — delivered to your
            inbox, never spam.
          </p>
        </motion.div>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mx-auto mt-9 inline-flex items-center gap-2.5 rounded-full border border-aqua/40 bg-white/10 px-7 py-3.5 text-sm text-snow backdrop-blur-sm"
          >
            <Check className="h-4 w-4 text-aqua" strokeWidth={2} />
            Welcome to the Zhanna family — check your inbox.
          </motion.div>
        ) : (
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="mx-auto mt-9 flex max-w-lg items-stretch overflow-hidden rounded-full border border-white/20 bg-white/10 p-1.5 backdrop-blur-sm focus-within:border-aqua/70 focus-within:shadow-[0_0_0_4px_rgba(22,181,216,0.15)]"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address for newsletter"
              className="w-full min-w-0 bg-transparent px-5 text-sm text-snow outline-none placeholder:text-silver/50"
            />
            <button
              type="submit"
              className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-turquoise px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-navy-brand uppercase transition-all duration-500 hover:-translate-y-0.5 hover:bg-aqua hover:shadow-[0_14px_30px_-10px_rgba(22,181,216,0.6)] active:scale-[0.98] sm:px-8"
            >
              Subscribe
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.form>
        )}
      </div>
    </WavyBackground>
  );
}
