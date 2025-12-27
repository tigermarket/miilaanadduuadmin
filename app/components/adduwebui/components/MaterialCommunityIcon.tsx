// adduwebui/components/Icon/MaterialCommunityIcon.tsx
import * as React from "react";
import Icon from "@mdi/react";
import * as mdi from "@mdi/js"; // contains all MaterialCommunityIcons paths
import { black } from "../styles/themes/colors";

export type IconProps = {
  name: keyof typeof mdi; // e.g. "mdiHome", "mdiAccount"
  color?: string;
  size: number;
  direction?: "rtl" | "ltr";
  testID?: string;
};

export const accessibilityProps = {
  role: "img",
  focusable: false,
};

const MaterialCommunityIcon = ({
  name,
  color = black,
  size,
  direction = "ltr",
  testID,
}: IconProps) => {
  const path = mdi[name];
  if (!path) {
    throw new Error(`Icon "${name}" not found in @mdi/js`);
  }

  return (
    <Icon
      path={path}
      size={size / 24} // @mdi/react uses relative sizing (1 = 24px)
      color={color}
      horizontal={direction === "rtl"} // flips horizontally
      aria-hidden="true"
      data-testid={testID}
      {...accessibilityProps}
      style={{ lineHeight: size, backgroundColor: "transparent" }}
    />
  );
};

export default MaterialCommunityIcon;
