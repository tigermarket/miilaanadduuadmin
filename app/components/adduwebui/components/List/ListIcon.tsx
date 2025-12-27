// adduwebui/components/ListIcon.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import type { ThemeProp } from "../../types";
import Icon, { IconSource } from "../Icon";

export type Props = {
  /** Icon to show */
  icon: IconSource;
  /** Color for the icon */
  color?: string;
  style?: React.CSSProperties;
  /** @optional */
  theme?: ThemeProp;
};

const ICON_SIZE = 24;

/**
 * A component to show an icon in a list item.
 *
 * ## Usage
 * ```tsx
 * import * as React from "react";
 * import ListIcon from "./ListIcon";
 *
 * const MyComponent = () => (
 *   <>
 *     <ListIcon color="#888" icon="folder" />
 *     <ListIcon color="#888" icon="equal" />
 *     <ListIcon color="#888" icon="calendar" />
 *   </>
 * );
 * export default MyComponent;
 * ```
 */
const ListIcon = ({
  icon,
  color: iconColor,
  style,
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <Icon source={icon} size={ICON_SIZE} color={iconColor} theme={theme} />
    </div>
  );
};

ListIcon.displayName = "List.Icon";

export default ListIcon;
