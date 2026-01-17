import type { Metadata } from "next";
import "../globals.css";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { AdduProvider } from "@/components/adduwebui";
import { routing } from "../../i18n/routing";
import { notFound } from "next/navigation";
import { geistMono, geistSans } from "@/fonts";

export const metadata: Metadata = {
  title: {
    template: "%s | Miilaan Dashboard",
    default: "Miilaan Dashboard",
  },
  description:
    "Miilaan, the ultimate collection for e-commerce,entertainment,school,hospitals,promotion,e-banking/wallet dashboard",
  metadataBase: new URL("https://miilaan.com"),
};
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <NextIntlClientProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AdduProvider>{children}</AdduProvider>
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
