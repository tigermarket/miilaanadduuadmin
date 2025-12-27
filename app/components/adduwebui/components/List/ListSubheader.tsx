// adduwebui/components/ListSubheader.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import type { ThemeProp } from "../../types";
import Text from "../Typography/Text";

export type Props = React.ComponentProps<typeof Text> & {
  /** @optional */
  theme?: ThemeProp;
  /** Style passed to Text element */
  style?: React.CSSProperties;
  /** Largest possible scale a text font can reach */
  maxFontSizeMultiplier?: number;
};

/**
 * A component used to display a header in lists.
 *
 * ## Usage
 * ```tsx
 * import * as React from "react";
 * import { ListSubheader } from "./ListSubheader";
 *
 * const MyComponent = () => <ListSubheader>My List Title</ListSubheader>;
 * export default MyComponent;
 * ```
 */
const ListSubheader = ({
  style,
  theme: overrideTheme,
  maxFontSizeMultiplier,
  ...rest
}: Props) => {
  const theme = useInternalTheme(overrideTheme);

  const textColor = theme.colors.onSurfaceVariant;
  const font = theme.fonts.bodyMedium;

  return (
    <Text
      variant="bodyMedium"
      numberOfLines={1}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
      style={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 13,
        paddingBottom: 13,
        color: textColor,
        ...font,
        ...style,
      }}
    />
  );
};

ListSubheader.displayName = "List.Subheader";

export default ListSubheader;
