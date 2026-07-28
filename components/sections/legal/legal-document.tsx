import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";

type LegalSection = {
  key: string;
  heading: string;
  body: string;
};

type LegalDocumentProps = {
  title: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  /** Optional lead paragraph shown above the first section. */
  intro?: string;
  sections: readonly LegalSection[];
};

/**
 * Shared reading layout for legal/reference pages — deliberately plain:
 * no hero treatment and no heading glow, unlike marketing sections.
 */
export function LegalDocument({
  title,
  lastUpdatedLabel,
  lastUpdated,
  intro,
  sections,
}: LegalDocumentProps) {
  return (
    <main id="main-content" tabIndex={-1}>
      <Section tone="white" spacing="tight" aria-labelledby="legal-title">
        <Container size="sm">
          <Heading id="legal-title" as="h1" size="h1" className="tracking-tight">
            {title}
          </Heading>
          <p className="mt-3 text-sm text-muted-foreground">
            {lastUpdatedLabel}: {lastUpdated}
          </p>

          {intro ? (
            <p className="mt-8 text-body leading-relaxed text-muted-foreground">
              {intro}
            </p>
          ) : null}

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.key} className="space-y-3">
                <h2 className="font-sans text-lg font-semibold tracking-tight text-foreground">
                  {section.heading}
                </h2>
                <p className="text-body leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
