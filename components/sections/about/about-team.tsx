"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/shared/heading";
import {
  SectionReveal,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { teamMembers } from "@/lib/team";

export function AboutTeam() {
  const t = useTranslations("About.team");

  return (
    <Section
      tone="muted"
      spacing="md"
      aria-labelledby="about-team-heading"
    >
      <Container size="lg">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <p className="text-caption font-semibold tracking-[0.14em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <Heading
            id="about-team-heading"
            size="h2"
            align="center"
            className="mt-3 font-display tracking-tight"
          >
            {t("title")}
          </Heading>
          <p className="mt-4 font-sans text-body-lg text-muted-foreground">
            {t("description")}
          </p>
        </SectionReveal>

        <Stagger className="mt-12 grid gap-8 md:grid-cols-2 md:gap-10">
          {teamMembers.map((member) => (
            <StaggerItem key={member.id}>
              <article className="h-full">
                <div className="overflow-hidden rounded-2xl bg-card">
                  {member.imageSrc ? (
                    <Image
                      src={member.imageSrc}
                      alt={t(`members.${member.nameKey}.imageAlt`)}
                      width={900}
                      height={1100}
                      sizes="(max-width: 768px) 90vw, 420px"
                      className="aspect-[4/5] w-full object-cover"
                      style={
                        member.imageObjectPosition
                          ? { objectPosition: member.imageObjectPosition }
                          : undefined
                      }
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={t(`members.${member.nameKey}.imageAlt`)}
                      className="flex aspect-[4/5] w-full items-center justify-center bg-[linear-gradient(160deg,#10283b,#07121e)]"
                    >
                      <span
                        aria-hidden
                        className="font-display text-5xl tracking-tight text-primary/90"
                      >
                        {member.initials}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-5">
                  <p className="text-caption font-semibold tracking-[0.12em] text-primary uppercase">
                    {t(`members.${member.nameKey}.role`)}
                  </p>
                  <h3 className="mt-2 font-display text-h2 tracking-tight text-foreground">
                    {t(`members.${member.nameKey}.name`)}
                  </h3>
                  <p className="mt-3 font-sans text-body leading-relaxed text-muted-foreground">
                    {t(`members.${member.nameKey}.bio`)}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
