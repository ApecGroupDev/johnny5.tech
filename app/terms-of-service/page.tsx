import { Container } from "@/app/components/ui/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Johnny5",
};

export default function TermsOfService() {
  return (
    <Container className="py-24">
      <div className="prose prose-invert max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink mb-8">Terms of Service</h1>
        <div className="text-muted space-y-6 leading-relaxed">
          <p>Last updated: August 5, 2026</p>
          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">1. Agreement to Terms</h2>
            <p>By viewing or using this website, which can be accessed at johnny5.tech, you are agreeing to be bound by these website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on Johnny5&apos;s Website for personal, non-commercial transitory viewing only.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">3. Disclaimer</h2>
            <p>All the materials on Johnny5&apos;s Website are provided &quot;as is&quot;. Johnny5 makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Johnny5 does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">4. Limitations</h2>
            <p>Johnny5 or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Johnny5&apos;s Website, even if Johnny5 or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">5. Revisions and Errata</h2>
            <p>The materials appearing on Johnny5&apos;s Website may include technical, typographical, or photographic errors. Johnny5 will not promise that any of the materials in this Website are accurate, complete, or current.</p>
          </section>
        </div>
      </div>
    </Container>
  );
}
