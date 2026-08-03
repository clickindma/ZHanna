import { LegalPage } from "@/components/shared/legal-page";
import { BRAND } from "@/lib/constants";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms of Service"
      title={
        <>
          The terms that keep things{" "}
          <span className="text-gradient-gold italic">brilliant & fair.</span>
        </>
      }
      description={`Please read these terms carefully. By accessing the Zhanna website and placing an order, you agree to be bound by these terms of service, together with our privacy policy. These terms are between you and ${BRAND.company}, operating as Zhanna.`}
      lastUpdated="August 2026"
      sections={[
        {
          heading: "Eligibility & accounts",
          body: [
            "You must be at least 18 years of age, or shop under the supervision of a parent or guardian, to place an order on Zhanna.",
            "When you create an account, you agree to provide accurate, complete information and to keep your password confidential. You are responsible for activity under your account.",
          ],
        },
        {
          heading: "Products & pricing",
          body: [
            "All products are described and photographed as accurately as possible. Small variations in shade, finish or hand-finishing are natural and reflect the handcrafted character of our jewellery.",
            "Prices are displayed in Indian Rupees and inclusive of applicable taxes unless stated otherwise. We reserve the right to correct pricing errors before an order is accepted.",
            "Trademarked as Zhanna — Trademark No. " + BRAND.trademarkNumber + " — our designs, imagery, logo and content are protected under the Trade Marks Act, 1999 and copyright law. They may not be reproduced without written permission.",
          ],
        },
        {
          heading: "Orders & acceptance",
          body: [
            "Placing an item in your bag or submitting an order does not constitute acceptance. We confirm acceptance when we dispatch your order and send a shipping confirmation.",
            "We may decline or cancel an order for reasons including stock unavailability, payment failure, suspected fraud, or pricing errors. If your payment was taken for a cancelled order, a full refund will be initiated.",
          ],
        },
        {
          heading: "Payments",
          body: [
            "We accept payments through secure gateways including UPI, cards and net banking. Payment details are handled by our payment partners and are never stored by us.",
            "By completing a purchase you authorise the charge. All transactions are governed by the terms of the applicable payment provider.",
          ],
        },
        {
          heading: "Shipping & returns",
          body: [
            "Shipping and delivery timelines are set out on our Shipping & Delivery page, and our returns and exchange policy is detailed on the Returns & Exchanges page. Both form part of these terms.",
            "Risk of loss passes to you once the order is delivered to your provided address or to the courier&apos;s collection point as applicable.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "To the maximum extent permitted by law, Zhanna&apos;s total liability arising out of or related to an order shall not exceed the amount you paid for that order.",
            "We are not liable for indirect or consequential losses, including loss of profit, data or goodwill, arising from your use of the website or services.",
          ],
        },
        {
          heading: "Governing law",
          body: [
            "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts at Gurgaon, Haryana.",
            "If any provision of these terms is found unenforceable, the remaining provisions continue in full force and effect.",
          ],
        },
        {
          heading: "Contact",
          body: [
            `For questions about these terms, contact us at ${BRAND.email} or at ${BRAND.address}, ${BRAND.country}.`,
          ],
        },
      ]}
    />
  );
}
