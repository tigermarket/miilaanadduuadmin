"use client";
import { geistSans } from "@/fonts";
import Image from "next/image";
import Link from "next/link";
import { Text, useTheme } from "../adduwebui";
import { brandColors } from "../../../constants/brandColors";

export default function MiilComLogo() {
  const theme = useTheme();
  return (
    <Link
      className="mb-2 flex h-20 items-end justify-start rounded-md  0 p-4 md:h-40"
      href="/miilaanCommerce"
      style={{ backgroundColor: brandColors.first }}
    >
      <div
        className={`${geistSans.className} flex flex-row items-center leading-none text-white`}
      >
        <Image
          src="/images/icon.png"
          alt="Miilcom image"
          width={32}
          height={32}
          className="rotate-[15]"
        />
        <Text
          variant="headlineMedium"
          style={{ marginLeft: 2, color: theme.colors.onPrimary }}
        >
          Commerce.Miilcom
        </Text>
      </div>
    </Link>
  );
}
