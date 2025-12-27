import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Text } from "../components/adduwebui";
import LanguageSwitcher from "@/components/settings/Language";
import SignIn from "@/components/authenthication/SignIn";

export default async function LoginPage() {
  const t = await getTranslations("Product");
  return (
    <div className="relative h-screen">
      <Image
        src="/backgroundImage/first.png"
        alt="Background"
        fill
        className="-z-10"
        priority
      />

      <div className="absolute inset-0 bg-black/25 -z-5" />

      <div className="flex items-center justify-center h-full">
        <SignIn />
      </div>
    </div>
  );
}
