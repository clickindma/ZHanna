import { LegalPage } from "@/components/shared/legal-page";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Zhanna / Malna Industries (OPC) Private Limited collects, uses and protects your personal information when you shop with us.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title={
        <>
          Your data, handled with the same care as{" "}
          <span className="text-gradient-gold italic">your jewellery.</span>
        </>
      }
      description={`This policy explains how ${BRAND.company} (operating as Zhanna) collects, uses, stores and protects your personal information when you use the Zhanna website, mobile experience and client services.`}
      lastUpdated="August 2026"
      sections={[
        {
          heading: "Introduction",
          body: [
            `At ${BRAND.company}, operating as Zhanna, we treat your privacy with the same care and attention we bring to crafting every piece of jewellery. This Privacy Policy describes the personal information we collect, how we use it, the choices you have, and how to contact us with any privacy-related questions.`,
            "By using our website, creating an account or placing an order, you agree to the practices described in this policy.",
          ],
        },
        {
          heading: "Information we collect",
          body: [
            "We collect information you provide directly to us. When you create an account, place an order, subscribe to our newsletter or contact our client care team, we may collect your name, email address, phone number, shipping and billing address.",
            "When you place an order, we collect payment details necessary to complete the transaction. Payment information is processed securely by our payment partners and is never stored on our servers.",
            "When you browse the website, we may automatically collect limited browsing data such as device type, browser, IP address, pages visited and time spent on the site, used to keep the site secure and improve your experience.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "We use your information to process and deliver orders, confirm and authorize payments, send order updates and shipping notifications, and provide customer support, warranty, repair or returns assistance.",
            "With your consent, we may send you marketing communications about new collections, private sales and styling stories. You can unsubscribe at any time using the link in every email we send.",
            "We may use aggregated, anonymised browsing data to understand how the website is used and to improve our products, services and online experience.",
          ],
        },
        {
          heading: "Sharing of information",
          body: [
            "We share your information only with trusted service providers who help us operate, such as payment gateways processing your payment, logistics partners delivering your order and email providers sending order updates.",
            "These partners may access your information only to perform their services on our behalf and are bound by confidentiality obligations. We never sell, rent or trade your personal information to third parties.",
            "We may disclose information where required by law, regulation or legal process, or to protect the rights, property or safety of Zhanna, our customers or others.",
          ],
        },
        {
          heading: "Cookies and tracking",
          body: [
            "We use essential cookies to keep your cart, session and sign-in secure and functional, and limited analytics cookies to understand how visitors use our website.",
            "You can manage or disable cookies in your browser settings at any time. Please note that some features of the website, such as your shopping bag, may not work as smoothly without them.",
          ],
        },
        {
          heading: "Data security",
          body: [
            "Your personal information is protected with industry-standard safeguards, including secure transmission of payment data and restricted access to your information for authorised team members only.",
            "We regularly review our security practices to guard against unauthorised access, alteration, disclosure or destruction of the information we hold.",
            `As ${BRAND.company}, we comply with the Information Technology Act, 2000 and the rules made thereunder in India.`,
          ],
        },
        {
          heading: "Your rights",
          body: [
            `You may request a copy of the personal information we hold about you, ask us to correct any inaccuracies, or request the deletion of your account by writing to us at ${BRAND.email}.`,
            "You may also update or close your account at any time through our client care team. We retain order records only as long as required for legal, tax and warranty obligations.",
          ],
        },
        {
          heading: "Third-party services",
          body: [
            "We use trusted third-party services to power parts of our website and operations, including payment gateways, analytics providers, logistics partners and email service providers.",
            "These third parties have their own privacy policies and process your data in accordance with applicable law. We encourage you to review their policies for a complete understanding of how your information is handled.",
          ],
        },
        {
          heading: "Changes to this privacy policy",
          body: [
            "We may update this Privacy Policy from time to time to reflect changes in our practices, technology or legal requirements. Any changes will be posted on this page with an updated revision date.",
            "Where changes are significant, we will take reasonable steps to notify you, including by email where appropriate.",
          ],
        },
        {
          heading: "Contact us",
          body: [
            `If you have any questions about this Privacy Policy or how your information is handled, please email us at ${BRAND.email} or write to us at ${BRAND.address}, ${BRAND.country}.`,
            "Our client care team will be happy to assist you with any privacy-related request.",
          ],
        },
      ]}
    />
  );
}
