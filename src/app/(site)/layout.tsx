import { Providers } from "@/components/providers";
import { AccentScope } from "@/components/accent-scope";
import { getPublishedPortfolio } from "@/lib/data";

export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const result = await getPublishedPortfolio();
  const theme = result.status === "ok" ? result.data.settings.theme : null;
  return (
    <Providers
      defaultTheme={theme?.default_mode ?? "dark"}
      forcedTheme={theme && !theme.allow_toggle && theme.default_mode !== "system" ? theme.default_mode : undefined}
    >
      <AccentScope accent={theme?.accent ?? "#3B82F6"}>{children}</AccentScope>
    </Providers>
  );
}
