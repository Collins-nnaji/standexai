import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata = {
  title: "Terms of Use | StandexAI",
  description: "Terms governing use of StandexAI services.",
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Use" eyebrow="Legal">
      <p>
        These Terms of Use (&quot;Terms&quot;) govern access to and use of StandexAI&apos;s websites and software services. By
        using the Services, you agree to these Terms. If you are using the Services on behalf of an organization, you
        represent that you have authority to bind that organization.
      </p>
      <h2>Accounts and acceptable use</h2>
      <p>
        You are responsible for safeguarding credentials and for activity under your account. You agree not to misuse the
        Services, including by attempting to probe, scan, or exploit vulnerabilities; interfere with other users; or
        use the Services in violation of law or third-party rights.
      </p>
      <h2>Content</h2>
      <p>
        You retain rights to content you submit. You grant us a limited license to host, process, and display that
        content solely to provide the Services. You represent that you have the rights needed for us to process your
        content as described in our Privacy Policy and any applicable DPA.
      </p>
      <h2>Disclaimers</h2>
      <p>
        The Services may use AI-generated outputs. Outputs may be inaccurate or incomplete. You are responsible for
        reviewing material before reliance, especially in regulated or high-risk contexts. The Services are provided
        &quot;as is&quot; to the extent permitted by law.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, StandexAI and its suppliers will not be liable for indirect, incidental,
        special, consequential, or punitive damages, or for loss of profits, data, or goodwill. Aggregate liability for
        any claim arising out of these Terms or the Services will be limited to amounts you paid us for the Services in
        the twelve months before the claim, unless a separate signed agreement provides otherwise.
      </p>
      <h2 id="services">Services agreement (Pro &amp; Enterprise)</h2>
      <p>
        Paid plans are governed by an order form, statement of work, or master services agreement between you and
        StandexAI, including service levels, fees, and termination. If there is a conflict between these Terms and a
        signed enterprise agreement, the signed agreement controls for that engagement.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these Terms periodically. Material changes will be communicated as required by law or contract.
        Continued use after changes constitutes acceptance where permitted.
      </p>
    </LegalPageShell>
  );
}
