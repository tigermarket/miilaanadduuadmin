// // adduwebui/core/AdduProvider.tsx
// "use client";
// import * as React from "react";
// import type { ThemeProp } from "../types";
// import { getTheme, ThemeProvider } from "./theming";

// export type Props = {
//   children: React.ReactNode;
//   theme?: ThemeProp;
// };

// const AdduProvider = (props: Props) => {
//   // Detect system color scheme (light/dark)
//   const getSystemColorScheme = (): "light" | "dark" => {
//     if (typeof window !== "undefined" && window.matchMedia) {
//       return window.matchMedia("(prefers-color-scheme: dark)").matches
//         ? "dark"
//         : "light";
//     }
//     return "light";
//   };

//   // Detect reduced motion preference
//   const getReduceMotion = (): boolean => {
//     if (typeof window !== "undefined" && window.matchMedia) {
//       return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     }
//     return false;
//   };

//   const [colorScheme, setColorScheme] = React.useState<"light" | "dark">(
//     getSystemColorScheme()
//   );
//   const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState<boolean>(
//     getReduceMotion()
//   );

//   // Listen for system color scheme changes
//   React.useEffect(() => {
//     if (typeof window !== "undefined" && window.matchMedia) {
//       const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//       const handler = (e: MediaQueryListEvent) =>
//         setColorScheme(e.matches ? "dark" : "light");
//       mediaQuery.addEventListener("change", handler);
//       return () => mediaQuery.removeEventListener("change", handler);
//     }
//   }, []);

//   // Listen for reduced motion changes
//   React.useEffect(() => {
//     if (typeof window !== "undefined" && window.matchMedia) {
//       const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
//       const handler = (e: MediaQueryListEvent) =>
//         setReduceMotionEnabled(e.matches);
//       mediaQuery.addEventListener("change", handler);
//       return () => mediaQuery.removeEventListener("change", handler);
//     }
//   }, []);

//   // Build theme object
//   const theme = React.useMemo(() => {
//     const isDark = colorScheme === "dark";
//     const defaultThemeBase = getTheme(isDark);

//     const extendedThemeBase = {
//       ...defaultThemeBase,
//       ...props.theme,
//       version: 3,
//       animation: {
//         ...props.theme?.animation,
//         scale: reduceMotionEnabled ? 0 : 1,
//       },
//     };

//     return {
//       ...extendedThemeBase,
//       isV3: true,
//     };
//   }, [colorScheme, props.theme, reduceMotionEnabled]);

//   return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
// };

// export default AdduProvider;
// adduwebui/core/AdduProvider.tsx
"use client";
import * as React from "react";

import MaterialCommunityIcon from "../components/MaterialCommunityIcon";
import type { ThemeProp } from "../types";
import { Settings, Provider as SettingsProvider } from "./settings";
import { getTheme, ThemeProvider } from "./theming";

export type Props = {
  children: React.ReactNode;
  theme?: ThemeProp;
  settings?: Settings;
};

const AdduProvider = ({ children, theme: themeOverrides, settings }: Props) => {
  // Detect system color scheme (light/dark)
  const getSystemColorScheme = (): "light" | "dark" => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  // Detect reduced motion preference
  const getReduceMotion = (): boolean => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  };

  const [colorScheme, setColorScheme] = React.useState<"light" | "dark">(
    getSystemColorScheme()
  );
  const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState<boolean>(
    getReduceMotion()
  );

  // Listen for system color scheme changes
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) =>
        setColorScheme(e.matches ? "dark" : "light");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Listen for reduced motion changes
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handler = (e: MediaQueryListEvent) =>
        setReduceMotionEnabled(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Build theme object
  const theme = React.useMemo(() => {
    const isDark = colorScheme === "dark";
    const defaultThemeBase = getTheme(isDark);

    const extendedThemeBase = {
      ...defaultThemeBase,
      ...themeOverrides,
      version: 3,
      animation: {
        ...themeOverrides?.animation,
        scale: reduceMotionEnabled ? 0 : 1,
      },
    };

    return {
      ...extendedThemeBase,
      isV3: true,
    };
  }, [colorScheme, themeOverrides, reduceMotionEnabled]);

  // Settings context value
  const settingsValue = React.useMemo(
    () => ({
      icon: MaterialCommunityIcon,
      rippleEffectEnabled: true,
      ...settings,
    }),
    [settings]
  );

  return (
    <SettingsProvider value={settingsValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SettingsProvider>
  );
};

export default AdduProvider;
