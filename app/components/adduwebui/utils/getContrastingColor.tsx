// adduwebui/utils/getContrastingColor.tsx
import color from "./color";

/**
 * Returns either the light or dark contrasting color
 * depending on whether the input color is light.
 *
 * @param input - CSS color string (hex, rgb, etc.)
 * @param light - Fallback color if input is dark
 * @param dark  - Fallback color if input is light
 */
export default function getContrastingColor(
  input: string,
  light: string,
  dark: string
): string {
  if (typeof input === "string") {
    return color(input).isLight() ? dark : light;
  }
  return light;
}
