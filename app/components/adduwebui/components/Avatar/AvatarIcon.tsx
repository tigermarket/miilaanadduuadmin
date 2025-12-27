// adduwebui/components/AvatarIcon.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import { white } from "../../styles/themes/colors";
import type { ThemeProp } from "../../types";

import Icon, { IconSource } from "../Icon";
import getContrastingColor from "../../utils/getContrastingColor";

const defaultSize = 64;

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Icon to display for the Avatar */
  icon: IconSource;
  /** Size of the avatar */
  size?: number;
  /** Custom color for the icon */
  color?: string;
  style?: React.CSSProperties;
  /** @optional */
  theme?: ThemeProp;
};

const AvatarIcon = ({
  icon,
  size = defaultSize,
  style,
  theme: themeOverrides,
  color,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const backgroundColor =
    style?.backgroundColor ?? theme.colors?.primary ?? "#6200ee";

  const textColor =
    color ?? getContrastingColor(backgroundColor, white, "rgba(0, 0, 0, .54)");

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
      <Icon source={icon} color={textColor} size={size * 0.6} />
    </div>
  );
};

AvatarIcon.displayName = "Avatar.Icon";

export default AvatarIcon;
