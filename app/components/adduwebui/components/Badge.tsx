// adduwebui/components/Badge.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../core/theming";
import type { ThemeProp } from "../types";

const defaultSize = 20;

export type Props = React.HTMLAttributes<HTMLSpanElement> & {
  /** Whether the badge is visible */
  visible?: boolean;
  /** Content of the Badge */
  children?: string | number;
  /** Size of the Badge */
  size?: number;
  style?: React.CSSProperties;
  theme?: ThemeProp;
};

const Badge = ({
  children,
  size = defaultSize,
  style,
  theme: themeOverrides,
  visible = true,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const [opacity, setOpacity] = React.useState(visible ? 1 : 0);
  const isFirstRender = React.useRef(true);

  const {
    animation: { scale },
  } = theme;

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setOpacity(visible ? 1 : 0);
      return;
    }
    // Animate opacity change
    const timeout = setTimeout(() => {
      setOpacity(visible ? 1 : 0);
    }, 150 * scale);
    return () => clearTimeout(timeout);
  }, [visible, scale]);

  const backgroundColor = theme.colors.error;
  const textColor = theme.colors.onError;
  const borderRadius = size / 2;
  const paddingHorizontal = 3;

  return (
    <span
      {...rest}
      style={{
        opacity,
        backgroundColor,
        color: textColor,
        fontSize: size * 0.5,
        lineHeight: `${size}px`,
        height: size,
        minWidth: size,
        borderRadius,
        padding: `0 ${paddingHorizontal}px`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: `opacity ${150 * scale}ms ease-in-out`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
