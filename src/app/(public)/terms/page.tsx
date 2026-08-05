import { LegalPage } from "@/components/shared/legal-page";
import { BRAND } from "@/lib/constants";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions governing the use of the Zhanna website and your purchases. Operated by Malna Industries (OPC) Private Limited.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms & Conditions"
      title={
        <>
          The terms that keep things{" "}
          <span className="text-gradient-gold italic">brilliant & fair.</span>
        </>
      }
      description={`Please read these terms carefully. By accessing the Zhanna website and placing an order, you agree to be bound by these terms and conditions, together with our privacy policy. These terms are between you and ${BRAND.company}, operating as Zhanna.`}
      lastUpdated="August 2026"
      sections={[
        {
          heading: "Pricing",
          body: [
            "All prices on this website are in US$ (US Dollars), unless stated otherwise.",
          ],
        },
        {
          heading: "Accuracy of information",
          body: [
            "We carefully update all information on this website. However, we are not responsible for any typographical errors or unintentional misrepresentations.",
          ],
        },
        {
          heading: "Order acceptance",
          body: [
            "We reserve the right to reject or cancel any order without assigning any reason whatsoever.",
            "All orders are subject to payment approval and product availability. Zhanna shall not be liable for any loss or damage arising directly or indirectly from the decline of authorization for any transaction, including cases where the cardholder has exceeded the pre-set limit agreed with the acquiring bank.",
          ],
        },
        {
          heading: "Product presentation",
          body: [
            "Some product images may be enlarged to show details more clearly.",
            "Jewelry weights mentioned on the website are approximate.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "All content on this website is original and proprietary. Any resemblance to other websites is purely coincidental.",
            `All content on this website is the intellectual property of ${BRAND.company}, operating as Zhanna. For any queries regarding content, please email us at ${BRAND.email}.`,
          ],
        },
        {
          heading: "EMI payments",
          body: [
            "For payments through EMI, the value of the first installment paid at the time of checkout will be the same amount debited monthly for the selected EMI tenure.",
          ],
        },
        {
          heading: "Governing law & jurisdiction",
          body: [
            "Any dispute arising out of or in connection with this website or any purchase shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, India.",
          ],
        },
      ]}
    />
  );
}
