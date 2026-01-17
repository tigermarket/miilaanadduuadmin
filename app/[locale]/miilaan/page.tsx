// app/page.tsx
"use client";

import { AppTile } from "@/components";
import { Text } from "@/components/adduwebui";
import Image from "next/image";

const appLists = [
  {
    path: "miilaanPromotion",
    appImage: "/next.svg",
    appName: "MiilProm",
    bgColor: "first",
  },
  {
    path: "miilaanCommerce",
    appImage: "/next.svg",
    appName: "MiilCom",
    bgColor: "second",
  },
  {
    path: "miilaanEducation",
    appImage: "/next.svg",
    appName: "Miiledu",
    bgColor: "third",
  },
  {
    path: "miilaanEntertainment",
    appImage: "/next.svg",
    appName: "Miilenter",
    bgColor: "fourth",
  },
  {
    path: "miilaanAdminstration",
    appImage: "/next.svg",
    appName: "Miilad",
    bgColor: "fifth",
  },
  {
    path: "miilaanHospital",
    appImage: "/next.svg",
    appName: "Miilhos",
    bgColor: "second",
  },
];

export default function HomeScreen() {
  return (
    <div className="relative h-screen">
      <Image
        src="/backgroundImage/first.png"
        alt="Background"
        fill
        className="-z-10"
        priority
      />

      <div className="inset-0 bg-black/25 -z-5" />

      <div className="flex items-center justify-center w-screen h-screen">
        <div
          style={{
            flexDirection: "row",
          }}
        >
          {appLists.map((app, idx) => (
            <div
              style={{
                margin: 8,
                borderRadius: 4,
                padding: 8,
                display: "inline-block",
              }}
            >
              <AppTile item={app} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
