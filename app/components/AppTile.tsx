"use client";
import Image from "next/image";
import Link from "next/link";
import { brandColors } from "../../constants/brandColors";
import { Avatar, useTheme } from "./adduwebui";

export default function AppTile({ item }: any) {
  const theme = useTheme();
  return (
    <div className="flex flex-col items-center justify-center my-4 gap-3">
      <Link href={`/${item.path}`} className="p-1 rounded-full">
        <Avatar.Image
          source={item.appImage}
          style={{ backgroundColor: brandColors[item.bgColor] }}
        />
      </Link>
      <span
        className="text-lg font-semibold"
        style={{ color: theme.colors.onPrimary }}
      >
        {item.appName}
      </span>
    </div>
  );
}
