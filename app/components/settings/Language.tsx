"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "../../../i18n/routing";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const switchLocale = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <select onChange={(e) => switchLocale(e.target.value)}>
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
