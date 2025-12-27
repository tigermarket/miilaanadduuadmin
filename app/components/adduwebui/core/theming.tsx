// adduwebui/core/theming.tsx
"use client";
import type { ComponentType } from "react";
import { $DeepPartial, createTheming } from "../utils/react-theme-provider";

import { MD3DarkTheme, MD3LightTheme } from "../styles/themes";
import type {
  InternalTheme,
  MD3AndroidColors,
  MD3Theme,
  NavigationTheme,
} from "../types";
import color from "../utils/color";

export const DefaultTheme: MD3Theme = MD3LightTheme;

// Bind to InternalTheme for type safety
export const {
  ThemeProvider,
  withTheme,
  useTheme: useAppTheme,
} = createTheming<InternalTheme>(MD3LightTheme);

// Hook for typed theme usage
export function useTheme<T = MD3Theme>(overrides?: $DeepPartial<T>) {
  return useAppTheme<T>(overrides);
}

export const useInternalTheme = (
  themeOverrides?: $DeepPartial<InternalTheme>
) => useAppTheme<InternalTheme>(themeOverrides);

export const withInternalTheme = <Props extends { theme: InternalTheme }, C>(
  WrappedComponent: ComponentType<Props & { theme: InternalTheme }> & C
) => withTheme<Props, C>(WrappedComponent);

export const getTheme = (isDark = false): MD3Theme =>
  isDark ? MD3DarkTheme : MD3LightTheme;

// Adapt navigation themes (safe for web, optional)
export function adaptNavigationTheme(themes: {
  reactNavigationLight?: NavigationTheme;
  reactNavigationDark?: NavigationTheme;
  materialLight?: MD3Theme;
  materialDark?: MD3Theme;
}) {
  const {
    reactNavigationLight,
    reactNavigationDark,
    materialLight,
    materialDark,
  } = themes;

  const MD3Themes = {
    light: materialLight || MD3LightTheme,
    dark: materialDark || MD3DarkTheme,
  };

  const result: { LightTheme?: NavigationTheme; DarkTheme?: NavigationTheme } =
    {};

  if (reactNavigationLight) {
    result.LightTheme = getAdaptedTheme(reactNavigationLight, MD3Themes.light);
  }
  if (reactNavigationDark) {
    result.DarkTheme = getAdaptedTheme(reactNavigationDark, MD3Themes.dark);
  }

  return result;
}

const getAdaptedTheme = (
  theme: NavigationTheme,
  materialTheme: MD3Theme
): NavigationTheme => {
  const base: NavigationTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: materialTheme.colors.primary,
      background: materialTheme.colors.background,
      card: materialTheme.colors.elevation.level2,
      text: materialTheme.colors.onSurface,
      border: materialTheme.colors.outline,
      notification: materialTheme.colors.error,
    },
  };

  // Safe font injection for web
  if ((materialTheme as any).fonts) {
    return {
      ...base,
      fonts: {
        regular: {
          fontFamily:
            materialTheme.fonts.bodyMedium?.fontFamily ?? "Roboto, sans-serif",
          fontWeight: materialTheme.fonts.bodyMedium?.fontWeight ?? "400",
          letterSpacing: materialTheme.fonts.bodyMedium?.letterSpacing ?? 0,
        },
        medium: {
          fontFamily:
            materialTheme.fonts.titleMedium?.fontFamily ?? "Roboto, sans-serif",
          fontWeight: materialTheme.fonts.titleMedium?.fontWeight ?? "500",
          letterSpacing: materialTheme.fonts.titleMedium?.letterSpacing ?? 0,
        },
        bold: {
          fontFamily:
            materialTheme.fonts.headlineSmall?.fontFamily ??
            "Roboto, sans-serif",
          fontWeight: materialTheme.fonts.headlineSmall?.fontWeight ?? "700",
          letterSpacing: materialTheme.fonts.headlineSmall?.letterSpacing ?? 0,
        },
        heavy: {
          fontFamily:
            materialTheme.fonts.headlineLarge?.fontFamily ??
            "Roboto, sans-serif",
          fontWeight: materialTheme.fonts.headlineLarge?.fontWeight ?? "800",
          letterSpacing: materialTheme.fonts.headlineLarge?.letterSpacing ?? 0,
        },
      },
    } as NavigationTheme;
  }

  return base;
};

// Dynamic elevation colors for web
export const getDynamicThemeElevations = (scheme: MD3AndroidColors) => {
  const elevationValues: (string | number)[] = [
    "transparent",
    0.05,
    0.08,
    0.11,
    0.12,
    0.14,
  ];
  return elevationValues.reduce((elevations, elevationValue, index) => {
    return {
      ...elevations,
      [`level${index}`]:
        index === 0
          ? "transparent"
          : color(androidColorToHex(scheme.surface))
              .mix(
                color(androidColorToHex(scheme.primary)),
                elevationValue as number
              )
              .rgb()
              .string(),
    };
  }, {} as Record<string, string>);
};

function androidColorToHex(n: number) {
  const u = n >>> 0;
  const r = (u >> 16) & 0xff;
  const g = (u >> 8) & 0xff;
  const b = u & 0xff;
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
