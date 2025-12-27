// adduwebui/utils/hasTouchHandler.tsx
import type * as React from "react";

const touchableEvents = [
  "onClick",
  "onDoubleClick",
  "onMouseDown",
  "onMouseUp",
  "onTouchStart",
  "onTouchEnd",
] as const;

type TouchableEventObject = Partial<
  Record<
    (typeof touchableEvents)[number],
    (event: React.SyntheticEvent) => void
  >
>;

/**
 * Utility to check if a component has any touch/click handlers attached.
 */
export default function hasTouchHandler(
  touchableEventObject: TouchableEventObject
): boolean {
  return touchableEvents.some((event) => Boolean(touchableEventObject[event]));
}
