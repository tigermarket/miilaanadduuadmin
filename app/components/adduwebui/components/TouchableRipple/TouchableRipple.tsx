// adduwebui/components/TouchableRipple.tsx
import * as React from "react";
import { Settings, SettingsContext } from "../../core/settings";
import { useInternalTheme } from "../../core/theming";
import type { ThemeProp } from "../../types";
import { forwardRef } from "../../utils/forwardRef";
import hasTouchHandler from "../../utils/hasTouchHandler";
import type { PressableProps, PressableStateCallbackType } from "./Pressable";
import { Pressable } from "./Pressable";
import { getTouchableRippleColors } from "./utils";

export type Props = PressableProps & {
  borderless?: boolean;
  background?: object;
  centered?: boolean;
  disabled?: boolean;
  onPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  onLongPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  onPressIn?: (e: React.MouseEvent | React.TouchEvent) => void;
  onPressOut?: (e: React.MouseEvent | React.TouchEvent) => void;
  rippleColor?: string;
  underlayColor?: string;
  children:
    | ((state: PressableStateCallbackType) => React.ReactNode)
    | React.ReactNode;
  style?:
    | React.CSSProperties
    | ((state: PressableStateCallbackType) => React.CSSProperties);
  theme?: ThemeProp;
};

const TouchableRipple = (
  {
    style,
    background: _background,
    borderless = false,
    disabled: disabledProp,
    rippleColor,
    underlayColor: _underlayColor,
    children,
    theme: themeOverrides,
    ...rest
  }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const theme = useInternalTheme(themeOverrides);
  const { calculatedRippleColor } = getTouchableRippleColors({
    theme,
    rippleColor,
  });
  const { rippleEffectEnabled } = React.useContext<Settings>(SettingsContext);

  const { onPress, onLongPress, onPressIn, onPressOut } = rest;

  const handlePressIn = React.useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      onPressIn?.(e);

      if (rippleEffectEnabled) {
        const { centered } = rest;
        const button = e.currentTarget as HTMLElement;
        const style = window.getComputedStyle(button);
        const dimensions = button.getBoundingClientRect();

        let touchX: number;
        let touchY: number;

        const nativeEvent = (e as any).nativeEvent;
        const { changedTouches, touches } = nativeEvent || {};
        const touch = touches?.[0] ?? changedTouches?.[0];

        if (centered || !touch) {
          touchX = dimensions.width / 2;
          touchY = dimensions.height / 2;
        } else {
          touchX = touch?.clientX ?? (e as any).pageX;
          touchY = touch?.clientY ?? (e as any).pageY;
        }

        const size = centered
          ? Math.min(dimensions.width, dimensions.height) * 1.5
          : Math.max(dimensions.width, dimensions.height) * 2;

        const container = document.createElement("span");
        container.setAttribute("data-paper-ripple", "");
        Object.assign(container.style, {
          position: "absolute",
          pointerEvents: "none",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          borderTopLeftRadius: style.borderTopLeftRadius,
          borderTopRightRadius: style.borderTopRightRadius,
          borderBottomRightRadius: style.borderBottomRightRadius,
          borderBottomLeftRadius: style.borderBottomLeftRadius,
          overflow: centered ? "visible" : "hidden",
        });

        const ripple = document.createElement("span");
        Object.assign(ripple.style, {
          position: "absolute",
          pointerEvents: "none",
          backgroundColor: calculatedRippleColor,
          borderRadius: "50%",
          transitionProperty: "transform opacity",
          transitionDuration: `${Math.min(size * 1.5, 350)}ms`,
          transitionTimingFunction: "linear",
          transformOrigin: "center",
          transform: "translate3d(-50%, -50%, 0) scale3d(0.1, 0.1, 0.1)",
          opacity: "0.5",
          left: `${touchX}px`,
          top: `${touchY}px`,
          width: `${size}px`,
          height: `${size}px`,
        });

        container.appendChild(ripple);
        button.appendChild(container);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            Object.assign(ripple.style, {
              transform: "translate3d(-50%, -50%, 0) scale3d(1, 1, 1)",
              opacity: "1",
            });
          });
        });
      }
    },
    [onPressIn, rest, rippleEffectEnabled, calculatedRippleColor]
  );

  const handlePressOut = React.useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      onPressOut?.(e);

      if (rippleEffectEnabled) {
        const containers = (e.currentTarget as HTMLElement).querySelectorAll(
          "[data-paper-ripple]"
        ) as NodeListOf<HTMLElement>;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            containers.forEach((container) => {
              const ripple = container.firstChild as HTMLSpanElement;
              Object.assign(ripple.style, {
                transitionDuration: "250ms",
                opacity: "0",
              });
              setTimeout(() => {
                container.parentNode?.removeChild(container);
              }, 500);
            });
          });
        });
      }
    },
    [onPressOut, rippleEffectEnabled]
  );

  const hasPassedTouchHandler = hasTouchHandler({
    onClick: onPress,

    onMouseDown: onLongPress,
    onMouseUp: onPressOut,
    onTouchStart: onPressIn,
    onTouchEnd: onPressOut,
  });

  const disabled = disabledProp || !hasPassedTouchHandler;

  return (
    <Pressable
      {...rest}
      ref={ref}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={(state) => ({
        position: "relative",
        cursor: disabled ? "auto" : "pointer",
        transition: "150ms background-color",
        ...(borderless ? { overflow: "hidden" } : {}),
        ...(typeof style === "function" ? style(state) : style),
      })}
    >
      {(state) =>
        React.Children.only(
          typeof children === "function" ? children(state) : children
        )
      }
    </Pressable>
  );
};

TouchableRipple.supported = true;

const Component = forwardRef(TouchableRipple);

export default Component as typeof Component & { supported: boolean };
