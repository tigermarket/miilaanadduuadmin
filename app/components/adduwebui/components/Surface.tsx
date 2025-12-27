// adduwebui/components/Surface.tsx
import * as React from "react";
import { useInternalTheme } from "../core/theming";
import type { MD3Elevation, ThemeProp } from "../types";
import { forwardRef } from "../utils/forwardRef";
import shadow from "../styles/shadow"; // adapt this to return CSS box-shadow

export type Elevation = 0 | 1 | 2 | 3 | 4 | 5;

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  style?: React.CSSProperties;
  elevation?: Elevation;
  mode?: "flat" | "elevated";
  theme?: ThemeProp;
  testID?: string;
  container?: boolean;
};

const Surface = forwardRef<HTMLDivElement, Props>(
  (
    {
      elevation = 1,
      children,
      theme: overrideTheme,
      style,
      testID = "surface",
      mode = "elevated",
      ...props
    },
    ref
  ) => {
    const theme = useInternalTheme(overrideTheme);
    const { colors } = theme;

    const backgroundColor =
      colors.elevation?.[`level${elevation as MD3Elevation}`];

    const isElevated = mode === "elevated";

    return (
      <div
        {...props}
        ref={ref}
        data-testid={testID}
        style={{
          backgroundColor,
          borderRadius: 4,
          ...(isElevated && shadow(elevation)), // shadow() should return { boxShadow: "..."}
          ...style,
        }}
      >
        {children}
      </div>
    );
  }
);

export default Surface;
