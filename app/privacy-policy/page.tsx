import { Container } from "@/app/components/ui/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Johnny5",
};

export default function PrivacyPolicy() {
  return (
    <Container className="py-24">
      <div className="prose prose-invert max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink mb-8">Privacy Policy</h1>
        <div className="text-muted space-y-6 leading-relaxed">
          <p>Last updated: August 5, 2026</p>
          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">1. Introduction</h2>
            <p>Welcome to Johnny5.tech. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. Sessions are managed using secure JSON Web Tokens (JWTs) and user credentials are encrypted.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">5. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us.</p>
          </section>
        </div>
      </div>
    </Container>
  );
}
