// adduwebui/styles/shadow.tsx
import { MD3Colors } from "./themes/v3/tokens";

const MD3_SHADOW_OPACITY = 0.3;
const MD3_SHADOW_COLOR = MD3Colors.primary0;

/**
 * Returns CSS box-shadow style for given elevation level.
 * Elevation ranges from 0–5.
 */
export default function shadow(elevation: number = 0): React.CSSProperties {
  const shadows = [
    "none",
    `0px 1px 2px rgba(0,0,0,${MD3_SHADOW_OPACITY})`,
    `0px 2px 4px rgba(0,0,0,${MD3_SHADOW_OPACITY})`,
    `0px 4px 6px rgba(0,0,0,${MD3_SHADOW_OPACITY})`,
    `0px 6px 8px rgba(0,0,0,${MD3_SHADOW_OPACITY})`,
    `0px 8px 12px rgba(0,0,0,${MD3_SHADOW_OPACITY})`,
  ];

  return {
    boxShadow: shadows[elevation] || "none",
    // optional color token for consistency
    color: MD3_SHADOW_COLOR,
  };
}
