import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/shared/heading";
import { Text } from "@/components/shared/text";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main id="main-content" tabIndex={-1}>
      <Container size="md" className="flex flex-col justify-center gap-4 py-section">
        <Heading size="h2">{t("title")}</Heading>
        <Text tone="muted">{t("description")}</Text>
        <Link
          href="/"
          className="w-fit text-sm font-medium underline underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {t("backHome")}
        </Link>
      </Container>
    </main>
  );
}
