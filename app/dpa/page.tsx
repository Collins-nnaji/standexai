import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata = {
  title: "Data Processing Addendum | StandexAI",
  description: "Data processing terms for StandexAI customers.",
};

export default function DpaPage() {
  return (
    <LegalPageShell title="Data Processing Addendum" eyebrow="Legal">
      <p>
        This Data Processing Addendum (&quot;DPA&quot;) applies when StandexAI processes personal data on behalf of a customer
        in connection with the Services, and supplements the agreement between the parties. Capitalized terms not defined
        here have the meaning given in the main agreement or Privacy Policy.
      </p>
      <h2>Roles</h2>
      <p>
        The customer is the controller (or processor, as applicable) of personal data it instructs the Services to
        process. StandexAI processes such data only as a processor on documented instructions, unless otherwise required
        by law.
      </p>
      <h2>Processing instructions</h2>
      <p>
        StandexAI will process personal data to provide the Services in accordance with the agreement, the
        customer&apos;s configuration, and documented instructions. The customer is responsible for the lawfulness of
        processing and for providing any required notices and consents to data subjects.
      </p>
      <h2>Security</h2>
      <p>
        StandexAI implements appropriate technical and organizational measures designed to protect personal data,
        including access controls, encryption in transit where applicable, and monitoring. Further detail is available
        in security documentation shared under NDA.
      </p>
      <h2>Subprocessors</h2>
      <p>
        The customer authorizes StandexAI to engage subprocessors subject to equivalent data protection obligations.
        StandexAI remains responsible for subprocessors&apos; performance. Customers may request a current subprocessor list
        and reasonable advance notice of changes where contractually required.
      </p>
      <h2>International transfers</h2>
      <p>
        Where personal data is transferred internationally, the parties will rely on appropriate mechanisms such as
        standard contractual clauses or other valid transfer tools, as specified in the agreement or an addendum.
      </p>
      <h2>Assistance and deletion</h2>
      <p>
        StandexAI will assist the customer in responding to data subject requests where feasible, and will delete or
        return personal data at the end of the Services, subject to legal retention requirements.
      </p>
    </LegalPageShell>
  );
}
