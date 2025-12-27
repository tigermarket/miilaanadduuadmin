import { MD3Colors } from "./v3/tokens";

// Single-source shim for commonly-used legacy color names used across the codebase.
// These map to MD3 tokens; when fully migrated you can remove these and reference
// `MD3LightTheme.colors` directly.
export const black = MD3Colors.neutral0;
export const white = MD3Colors.neutral100;

export const red500 = MD3Colors.error50;
export const red300 = MD3Colors.error30;
export const red200 = MD3Colors.error20;

export const pink500 = MD3Colors.primary40;

export const grey200 = MD3Colors.neutral80;

export default {
  black,
  white,
  red500,
  red300,
  red200,
  pink500,
  grey200,
};
