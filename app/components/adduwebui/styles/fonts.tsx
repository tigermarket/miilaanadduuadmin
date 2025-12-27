// adduwebui/styles/fonts.ts
import type { Fonts, MD3Type, MD3Typescale, MD3TypescaleKey } from "../types";
import { typescale } from "./themes/v3/tokens";

export const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "400" as const,
    },
    medium: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "500" as const,
    },
    light: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "300" as const,
    },
    thin: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "100" as const,
    },
  },
  ios: {
    regular: {
      fontFamily: "System",
      fontWeight: "400" as const,
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500" as const,
    },
    light: {
      fontFamily: "System",
      fontWeight: "300" as const,
    },
    thin: {
      fontFamily: "System",
      fontWeight: "100" as const,
    },
  },
  default: {
    regular: {
      fontFamily: "sans-serif",
      fontWeight: "normal" as const,
    },
    medium: {
      fontFamily: "sans-serif-medium",
      fontWeight: "normal" as const,
    },
    light: {
      fontFamily: "sans-serif-light",
      fontWeight: "normal" as const,
    },
    thin: {
      fontFamily: "sans-serif-thin",
      fontWeight: "normal" as const,
    },
  },
};

type MD2FontsConfig = {
  [platform in "web" | "ios" | "default"]?: Fonts;
};

type MD3FontsConfig =
  | {
      [key in MD3TypescaleKey]: Partial<MD3Type>;
    }
  | {
      [key: string]: MD3Type;
    }
  | Partial<MD3Type>;

function configureV2Fonts(config: MD2FontsConfig): Fonts {
  // On web, always prefer web config, fallback to default
  const fonts = {
    ...(fontConfig.default || {}),
    ...(fontConfig.web || {}),
    ...(config.web || {}),
  } as Fonts;
  return fonts;
}

function configureV3Fonts(
  config: MD3FontsConfig
): MD3Typescale | (MD3Typescale & { [key: string]: MD3Type }) {
  if (!config) {
    return typescale;
  }

  const isFlatConfig = Object.keys(config).every(
    (key) => typeof config[key as keyof typeof config] !== "object"
  );

  if (isFlatConfig) {
    return Object.fromEntries(
      Object.entries(typescale).map(([variantName, variantProperties]) => [
        variantName,
        { ...variantProperties, ...config },
      ])
    ) as MD3Typescale;
  }

  return Object.assign(
    {},
    typescale,
    ...Object.entries(config).map(([variantName, variantProperties]) => ({
      [variantName]: {
        ...typescale[variantName as MD3TypescaleKey],
        ...variantProperties,
      },
    }))
  );
}

// Overloads
export default function configureFonts(params: { isV3: false }): Fonts;
export default function configureFonts(params: {
  config?: MD2FontsConfig;
  isV3: false;
}): Fonts;
export default function configureFonts(params?: {
  config?: Partial<MD3Type>;
  isV3?: true;
}): MD3Typescale;
export default function configureFonts(params?: {
  config?: Partial<Record<MD3TypescaleKey, Partial<MD3Type>>>;
  isV3?: true;
}): MD3Typescale;
export default function configureFonts(params: {
  config: Record<string, MD3Type>;
  isV3?: true;
}): MD3Typescale & { [key: string]: MD3Type };
export default function configureFonts(params?: any) {
  const { isV3 = true, config } = params || {};

  if (isV3) {
    return configureV3Fonts(config);
  }
  return configureV2Fonts(config);
}
