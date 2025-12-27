// adduwebui/components/Divider.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../core/theming";
import type { ThemeProp } from "../types";

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Whether divider has a left inset */
  leftInset?: boolean;
  /** Horizontal inset on both sides */
  horizontalInset?: boolean;
  /** Bold divider (thicker line) */
  bold?: boolean;
  style?: React.CSSProperties;
  theme?: ThemeProp;
};

const Divider = ({
  leftInset,
  horizontalInset = false,
  style,
  theme: themeOverrides,
  bold = false,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const dividerColor = theme.colors.outlineVariant;

  return (
    <div
      {...rest}
      style={{
        height: bold ? 1 : 0.5, // hairline width ~0.5px
        backgroundColor: dividerColor,
        marginLeft: leftInset ? 16 : undefined,
        marginRight: horizontalInset ? 16 : undefined,
        ...(horizontalInset ? { marginLeft: 16, marginRight: 16 } : {}),
        ...style,
      }}
    />
  );
};

export default Divider;
