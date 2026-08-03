import { LegalPage } from "@/components/shared/legal-page";
import { BRAND } from "@/lib/constants";

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
          heading: "Information we collect",
          body: [
            "When you create an account, place an order or contact client care, we collect the information you provide: your name, email address, phone number, shipping address and order details.",
            "When you use the website, we may automatically collect limited technical data such as device type, browser, IP address and pages visited, used to keep the site secure and improve performance.",
            "Payment information (card details or UPI references) is processed by our payment partners and is never stored on our servers.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "We use your information to process and deliver orders, confirm payments, provide order updates, respond to enquiries, and provide warranty, repair or returns support.",
            "With your consent, we may send marketing emails about new collections, restocks and offers. You can unsubscribe at any time using the link in every email.",
            "We never sell, rent or trade your personal information to third parties.",
          ],
        },
        {
          heading: "Data protection",
          body: [
            "Your personal information is stored securely and access is restricted to authorised team members only. We follow industry-standard safeguards to protect against unauthorised access, alteration or disclosure.",
            `As a registered house under ${BRAND.company}, we comply with the Information Technology Act, 2000 and the rules made thereunder in India.`,
          ],
        },
        {
          heading: "Cookies",
          body: [
            "We use essential cookies to keep your cart, session and sign-in secure, and limited analytics cookies to understand how the site is used.",
            "You can manage or disable cookies in your browser settings. Some site features, such as your shopping bag, may not work as smoothly without them.",
          ],
        },
        {
          heading: "Sharing your information",
          body: [
            "We share information only with service providers who help us operate — such as logistics partners delivering your order, payment gateways processing your payment, and email providers sending order updates.",
            "These partners may access your information only to perform their services on our behalf and are bound by confidentiality obligations.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You may request a copy of the personal information we hold about you, ask us to correct inaccuracies, or request deletion of your account by writing to us at " + BRAND.email,
            "You may also close your account at any time through client care. We retain order records only as long as required for legal, tax and warranty obligations.",
          ],
        },
        {
          heading: "Contact us",
          body: [
            `For any privacy questions or requests, please email ${BRAND.email} or write to us at ${BRAND.address}, ${BRAND.country}.`,
          ],
        },
      ]}
    />
  );
}
