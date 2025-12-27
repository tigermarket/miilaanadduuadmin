// adduwebui/components/ActivityIndicator.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../core/theming";
import type { ThemeProp } from "../types";

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  animating?: boolean;
  color?: string;
  size?: "small" | "large" | number;
  hidesWhenStopped?: boolean;
  theme?: ThemeProp;
};

const ActivityIndicator = ({
  animating = true,
  color: indicatorColor,
  hidesWhenStopped = true,
  size: indicatorSize = "small",
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const color = indicatorColor || theme.colors?.primary;
  const size =
    typeof indicatorSize === "string"
      ? indicatorSize === "small"
        ? 24
        : 48
      : indicatorSize || 24;

  // If not animating and hidesWhenStopped, render nothing
  if (!animating && hidesWhenStopped) {
    return null;
  }

  return (
    <div
      {...rest}
      role="progressbar"
      aria-busy={animating}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        ...style,
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          display: "block",
          width: "100%",
          height: "100%",
          border: `${size / 10}px solid ${color}33`, // faded track
          borderTopColor: color, // active color
          borderRadius: "50%",
          animation: animating ? "spin 1s linear infinite" : undefined,
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ActivityIndicator;
