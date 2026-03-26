import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata = {
  title: "Privacy Policy | StandexAI",
  description: "How StandexAI collects, uses, and protects personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" eyebrow="Legal">
      <p>
        This Privacy Policy describes how StandexAI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) handles information when you use
        our websites, applications, and services (collectively, the &quot;Services&quot;). If you are entering into a separate
        agreement with us (such as an order form or enterprise contract), those terms may supplement or override parts
        of this policy where they conflict.
      </p>
      <h2>Information we collect</h2>
      <p>
        We may collect account information you provide (such as name, email, and organization), content you submit for
        analysis or generation within the Services, technical data (such as device, browser, and approximate location),
        and communications you send to support. We use this to operate, secure, and improve the Services.
      </p>
      <h2>How we use information</h2>
      <p>
        We use data to provide and maintain the Services, authenticate users, personalize your experience, detect abuse,
        comply with law, and communicate with you about updates and security. We do not sell your personal information.
      </p>
      <h2>Subprocessors and transfers</h2>
      <p>
        We may use trusted infrastructure and AI providers to deliver the Services. Where data is transferred across
        borders, we implement appropriate safeguards consistent with applicable law. A current list of subprocessors is
        available to customers on request.
      </p>
      <h2>Retention</h2>
      <p>
        We retain information for as long as needed to provide the Services, meet legal obligations, resolve disputes,
        and enforce agreements. Retention periods may differ by data category and contract.
      </p>
      <h2>Your rights</h2>
      <p>
        Depending on your jurisdiction, you may have rights to access, correct, delete, or export personal data, or to
        object to certain processing. Contact us using the details below to exercise these rights.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy questions or requests, contact your account team or reach us through the contact options listed on
        our website. We may update this policy from time to time; the revised version will be posted with a new effective
        date.
      </p>
    </LegalPageShell>
  );
}
