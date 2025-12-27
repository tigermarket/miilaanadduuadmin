// adduwebui/components/Icon.tsx
"use client";
import * as React from "react";
import { Consumer as SettingsConsumer } from "../core/settings";
import { accessibilityProps } from "./MaterialCommunityIcon";
import type { ThemeProp } from "../types";

type IconSourceBase = string | { uri: string };

export type IconSource =
  | IconSourceBase
  | Readonly<{ source: IconSourceBase; direction: "rtl" | "ltr" | "auto" }>
  | ((props: IconProps & { color: string }) => React.ReactNode);

type IconProps = {
  size: number;
  allowFontScaling?: boolean;
};

const isImageSource = (source: any) =>
  (typeof source === "object" &&
    source !== null &&
    "uri" in source &&
    typeof source.uri === "string") ||
  (typeof source === "string" &&
    (source.startsWith("data:image") ||
      /\.(bmp|jpg|jpeg|png|gif|svg)$/.test(source)));

const getIconId = (source: any) => {
  if (typeof source === "object" && source !== null && "uri" in source) {
    return source.uri;
  }
  return source;
};

export const isValidIcon = (source: any) =>
  typeof source === "string" ||
  typeof source === "function" ||
  isImageSource(source);

export const isEqualIcon = (a: any, b: any) =>
  a === b || getIconId(a) === getIconId(b);

export type Props = IconProps & {
  source: any;
  color?: string;
  testID?: string;
  theme?: ThemeProp;
};

const Icon = ({ source, color, size, testID }: Props) => {
  // Determine direction
  const direction =
    typeof source === "object" && source.direction && source.source
      ? source.direction === "auto"
        ? typeof document !== "undefined" && document.dir === "rtl"
          ? "rtl"
          : "ltr"
        : source.direction
      : null;

  const s: any =
    typeof source === "object" && source.direction && source.source
      ? source.source
      : source;

  const iconColor = color;

  // Case 1: Image source (URL, data URI, etc.)
  if (isImageSource(s)) {
    return (
      <img
        src={typeof s === "string" ? s : s.uri}
        alt=""
        data-testid={testID}
        style={{
          transform: direction === "rtl" ? "scaleX(-1)" : undefined,
          width: size,
          height: size,
          objectFit: "contain",
          backgroundColor: "transparent",
          filter: iconColor ? `drop-shadow(0 0 0 ${iconColor})` : undefined,
        }}
        {...accessibilityProps}
      />
    );
  }

  // Case 2: String name → use SettingsConsumer to resolve to MaterialCommunityIcon
  if (typeof s === "string") {
    return (
      <SettingsConsumer>
        {({ icon }) => {
          const IconImpl = icon;
          return IconImpl ? (
            <IconImpl
              name={s}
              color={iconColor}
              size={size}
              direction={direction}
              testID={testID}
            />
          ) : null;
        }}
      </SettingsConsumer>
    );
  }

  // Case 3: Function → custom render
  if (typeof s === "function") {
    return s({ color: iconColor, size, direction, testID });
  }

  return null;
};

export default Icon;
