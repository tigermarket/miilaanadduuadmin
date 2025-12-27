// adduwebui/components/Pressable.tsx
import * as React from "react";

export type PressableStateCallbackType = {
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
};

export type PressableProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "style"
> & {
  children:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode);
  style?:
    | React.CSSProperties
    | ((state: PressableStateCallbackType) => React.CSSProperties);
};

/**
 * Web Pressable component: tracks hover, press, and focus states
 * and passes them into children and style callbacks.
 */
export const Pressable = React.forwardRef<HTMLDivElement, PressableProps>(
  ({ children, style, ...rest }, ref) => {
    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    const state: PressableStateCallbackType = { hovered, pressed, focused };

    const resolvedStyle =
      typeof style === "function" ? style(state) : style || {};

    const resolvedChildren =
      typeof children === "function" ? children(state) : children;

    return (
      <div
        ref={ref}
        {...rest}
        style={{
          cursor: "pointer",
          userSelect: "none",
          outline: "none",
          ...resolvedStyle,
        }}
        onMouseEnter={(e) => {
          setHovered(true);
          rest.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          setPressed(false);
          rest.onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          setPressed(true);
          rest.onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          setPressed(false);
          rest.onMouseUp?.(e);
        }}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
      >
        {resolvedChildren}
      </div>
    );
  }
);

Pressable.displayName = "Pressable";
