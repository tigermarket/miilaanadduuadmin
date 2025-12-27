// adduwebui/components/list/utils.ts
"use client";
import * as React from "react";
import type { EllipsizeProp, InternalTheme, ThemeProp } from "../../types";
import color from "../../utils/color";

type Description =
  | React.ReactNode
  | ((props: {
      selectable: boolean;
      ellipsizeMode?: EllipsizeProp;
      color: string;
      fontSize: number;
    }) => React.ReactNode);

export type ListChildProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: React.CSSProperties;
  theme?: ThemeProp;
};

export type Style = {
  marginLeft?: number;
  marginRight?: number;
  marginVertical?: number;
  alignSelf?: "flex-start" | "center" | "flex-end";
};

export const getLeftStyles = (
  alignToTop: boolean,
  description: Description,
  isV3: boolean
): React.CSSProperties => {
  const stylesV3: React.CSSProperties = {
    marginRight: 0,
    marginLeft: 16,
    alignSelf: alignToTop ? "flex-start" : "center",
  };

  if (!description) {
    return {
      ...baseStyles.iconMarginLeft,
      ...baseStyles.marginVerticalNone,
      ...(isV3 ? stylesV3 : {}),
    };
  }

  if (!isV3) {
    return baseStyles.iconMarginLeft;
  }

  return {
    ...baseStyles.iconMarginLeft,
    ...stylesV3,
  };
};

export const getRightStyles = (
  alignToTop: boolean,
  description: Description,
  isV3: boolean
): React.CSSProperties => {
  const stylesV3: React.CSSProperties = {
    marginLeft: 16,
    alignSelf: alignToTop ? "flex-start" : "center",
  };

  if (!description) {
    return {
      ...baseStyles.iconMarginRight,
      ...baseStyles.marginVerticalNone,
      ...(isV3 ? stylesV3 : {}),
    };
  }

  if (!isV3) {
    return baseStyles.iconMarginRight;
  }

  return {
    ...baseStyles.iconMarginRight,
    ...stylesV3,
  };
};

const baseStyles: Record<string, React.CSSProperties> = {
  marginVerticalNone: { marginTop: 0, marginBottom: 0 },
  iconMarginLeft: { marginLeft: 0, marginRight: 16 },
  iconMarginRight: { marginRight: 0 },
};

export const getAccordionColors = ({
  theme,
  isExpanded,
  customRippleColor,
}: {
  theme: InternalTheme;
  isExpanded?: boolean;
  customRippleColor?: string;
}) => {
  const titleColor = theme.colors.onSurface;
  const descriptionColor = theme.colors.onSurfaceVariant;
  const titleTextColor = isExpanded ? theme.colors?.primary : titleColor;

  const rippleColor =
    customRippleColor || color(titleTextColor).alpha(0.12).rgb().string();

  return {
    titleColor,
    descriptionColor,
    titleTextColor,
    rippleColor,
  };
};
