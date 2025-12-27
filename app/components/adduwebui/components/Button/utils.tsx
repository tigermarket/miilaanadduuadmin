// adduwebui/components/Button/utils.tsx
"use client";
import type { CSSProperties } from "react";
import color from "../../utils/color";
import { black, white } from "../../styles/themes/colors";
import type { InternalTheme } from "../../types";
import { splitStyles } from "../../utils/splitStyles";

export type ButtonMode =
  | "text"
  | "outlined"
  | "contained"
  | "elevated"
  | "contained-tonal";

type BaseProps = {
  isMode: (mode: ButtonMode) => boolean;
  theme: InternalTheme;
  disabled?: boolean;
};

const isDark = ({
  dark,
  backgroundColor,
}: {
  dark?: boolean;
  backgroundColor?: string;
}) => {
  if (typeof dark === "boolean") {
    return dark;
  }
  if (backgroundColor === "transparent") {
    return false;
  }
  if (
    typeof backgroundColor === "string" &&
    backgroundColor !== "transparent"
  ) {
    return !color(backgroundColor).isLight();
  }
  return false;
};

const getButtonBackgroundColor = ({
  isMode,
  theme,
  disabled,
  customButtonColor,
}: BaseProps & { customButtonColor?: string }) => {
  if (customButtonColor && !disabled) {
    return customButtonColor;
  }
  if (disabled) {
    if (isMode("outlined") || isMode("text")) {
      return "transparent";
    }
    return theme.colors.surfaceDisabled;
  }
  if (isMode("elevated")) {
    return theme.colors.elevation.level1;
  }
  if (isMode("contained")) {
    return theme.colors.primary;
  }
  if (isMode("contained-tonal")) {
    return theme.colors.secondaryContainer;
  }
  return "transparent";
};

const getButtonTextColor = ({
  isMode,
  theme,
  disabled,
  customTextColor,
  backgroundColor,
  dark,
}: BaseProps & {
  customTextColor?: string;
  backgroundColor: string;
  dark?: boolean;
}) => {
  if (customTextColor && !disabled) {
    return customTextColor;
  }
  if (disabled) {
    return theme.colors.onSurfaceDisabled;
  }
  if (typeof dark === "boolean") {
    if (
      isMode("contained") ||
      isMode("contained-tonal") ||
      isMode("elevated")
    ) {
      return isDark({ dark, backgroundColor }) ? white : black;
    }
  }
  if (isMode("outlined") || isMode("text") || isMode("elevated")) {
    return theme.colors.primary;
  }
  if (isMode("contained")) {
    return theme.colors.onPrimary;
  }
  if (isMode("contained-tonal")) {
    return theme.colors.onSecondaryContainer;
  }
  return theme.colors.primary;
};

const getButtonBorderColor = ({ isMode, disabled, theme }: BaseProps) => {
  if (disabled && isMode("outlined")) {
    return theme.colors.surfaceDisabled;
  }
  if (isMode("outlined")) {
    return theme.colors.outline;
  }
  return "transparent";
};

const getButtonBorderWidth = ({ isMode }: Omit<BaseProps, "disabled">) => {
  if (isMode("outlined")) {
    return 1;
  }
  return 0;
};

export const getButtonColors = ({
  theme,
  mode,
  customButtonColor,
  customTextColor,
  disabled,
  dark,
}: {
  theme: InternalTheme;
  mode: ButtonMode;
  customButtonColor?: string;
  customTextColor?: string;
  disabled?: boolean;
  dark?: boolean;
}) => {
  const isMode = (modeToCompare: ButtonMode) => mode === modeToCompare;

  const backgroundColor = getButtonBackgroundColor({
    isMode,
    theme,
    disabled,
    customButtonColor,
  });

  const textColor = getButtonTextColor({
    isMode,
    theme,
    disabled,
    customTextColor,
    backgroundColor,
    dark,
  });

  const borderColor = getButtonBorderColor({ isMode, theme, disabled });
  const borderWidth = getButtonBorderWidth({ isMode });

  return {
    backgroundColor,
    borderColor,
    textColor,
    borderWidth,
  };
};

type CSSBorderRadiusStyles = Partial<
  Pick<
    CSSProperties,
    | "borderBottomLeftRadius"
    | "borderBottomRightRadius"
    | "borderTopLeftRadius"
    | "borderTopRightRadius"
    | "borderRadius"
  >
>;

export const getButtonTouchableRippleStyle = (
  style?: CSSProperties,
  borderWidth: number = 0
): CSSBorderRadiusStyles => {
  if (!style) return {};
  const touchableRippleStyle: CSSBorderRadiusStyles = {};

  const [, borderRadiusStyles] = splitStyles(
    style,
    (prop) => prop.startsWith("border") && prop.endsWith("Radius")
  );

  (
    Object.keys(borderRadiusStyles) as Array<keyof CSSBorderRadiusStyles>
  ).forEach((key) => {
    const value = style[key];
    if (typeof value === "number") {
      const radius = value > 0 ? value - borderWidth : 0;
      touchableRippleStyle[key] = radius;
    }
  });

  return touchableRippleStyle;
};
