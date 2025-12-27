// adduwebui/components/AvatarText.tsx
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import { white } from "../../styles/themes/colors";
import type { ThemeProp } from "../../types";
import getContrastingColor from "../../utils/getContrastingColor";
import Text from "../Typography/Text";

const defaultSize = 64;

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Initials to show as the text in the Avatar */
  label: string;
  /** Size of the avatar */
  size?: number;
  /** Custom color for the text */
  color?: string;
  /** Style for text container */
  style?: React.CSSProperties;
  /** Style for the title */
  labelStyle?: React.CSSProperties;
  /** Specifies the largest possible scale a text font can reach */
  maxFontSizeMultiplier?: number;
  /** @optional */
  theme?: ThemeProp;
};

const AvatarText = ({
  label,
  size = defaultSize,
  style,
  labelStyle,
  color: customColor,
  theme: themeOverrides,
  maxFontSizeMultiplier,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const backgroundColor =
    style?.backgroundColor ?? theme.colors?.primary ?? "#6200ee";

  const textColor =
    customColor ??
    getContrastingColor(backgroundColor, white, "rgba(0, 0, 0, .54)");

  // Approximate fontScale using devicePixelRatio (fallback to 1)
  const fontScale =
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  return (
    <div
      {...rest}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <Text
        style={{
          color: textColor,
          fontSize: size / 2,
          lineHeight: size / fontScale,
          textAlign: "center",
          ...labelStyle,
        }}
        data-testid="avatar-text"
      >
        {label}
      </Text>
    </div>
  );
};

AvatarText.displayName = "Avatar.Text";

export default AvatarText;
