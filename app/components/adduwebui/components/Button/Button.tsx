// adduwebui/components/Button.tsx
"use client";
import * as React from "react";
import color from "../../utils/color";
import { useInternalTheme } from "../../core/theming";
import type { ThemeProp } from "../../types";
import hasTouchHandler from "../../utils/hasTouchHandler";
import ActivityIndicator from "../ActivityIndicator";
import Icon, { IconSource } from "../Icon";
import TouchableRipple from "../TouchableRipple/TouchableRipple";
import Text from "../Typography/Text";
import Surface from "../Surface";
import { getButtonColors, getButtonTouchableRippleStyle } from "./utils";

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
  dark?: boolean;
  compact?: boolean;
  color?: string;
  buttonColor?: string;
  textColor?: string;
  rippleColor?: string;
  loading?: boolean;
  icon?: IconSource;
  disabled?: boolean;
  children: React.ReactNode;
  uppercase?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  onPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  onPressIn?: (e: React.MouseEvent | React.TouchEvent) => void;
  onPressOut?: (e: React.MouseEvent | React.TouchEvent) => void;
  onLongPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  delayLongPress?: number;
  contentStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  theme?: ThemeProp;
  testID?: string;
};

const Button = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      disabled,
      compact,
      mode = "text",
      dark,
      loading,
      icon,
      buttonColor: customButtonColor,
      textColor: customTextColor,
      rippleColor: customRippleColor,
      children,
      accessibilityLabel,
      accessibilityHint,
      onPress,
      onPressIn,
      onPressOut,
      onLongPress,
      delayLongPress,
      style,
      theme: themeOverrides,
      uppercase: uppercaseProp,
      contentStyle,
      labelStyle,
      testID = "button",
      ...rest
    },
    ref
  ) => {
    const theme = useInternalTheme(themeOverrides);
    const { roundness } = theme;
    const uppercase = uppercaseProp ?? false;

    const hasPassedTouchHandler = hasTouchHandler({
      onPress,
      onPressIn,
      onPressOut,
      onLongPress,
    });

    const borderRadius = 5 * roundness;
    const iconSize = 18;

    const { backgroundColor, borderColor, textColor, borderWidth } =
      getButtonColors({
        customButtonColor,
        customTextColor,
        theme,
        mode,
        disabled,
        dark,
      });

    const rippleColor =
      customRippleColor || color(textColor).alpha(0.12).rgb().string();

    const touchableStyle = {
      borderRadius,
    };

    const buttonStyle: React.CSSProperties = {
      backgroundColor,
      borderColor,
      borderWidth,
      borderStyle: "solid",
      borderRadius,
      minWidth: compact ? "auto" : 64,
      ...touchableStyle,
      ...style,
    };

    const { color: customLabelColor, fontSize: customLabelSize } =
      labelStyle || {};

    const font = theme.fonts.labelLarge;
    const textStyle: React.CSSProperties = {
      color: textColor,
      ...font,
      ...labelStyle,
    };

    const iconContainerStyle: React.CSSProperties =
      contentStyle?.flexDirection === "row-reverse"
        ? { marginRight: 12, marginLeft: -4 }
        : { marginLeft: 12, marginRight: -4 };

    return (
      <Surface
        {...rest}
        ref={ref}
        data-testid={`${testID}-container`}
        style={buttonStyle}
        elevation={mode === "elevated" && !disabled ? 1 : 0}
      >
        <TouchableRipple
          borderless
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={hasPassedTouchHandler ? onPressIn : undefined}
          onPressOut={hasPassedTouchHandler ? onPressOut : undefined}
          delayLongPress={delayLongPress}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          disabled={disabled}
          rippleColor={rippleColor}
          style={getButtonTouchableRippleStyle(touchableStyle, borderWidth)}
          testID={testID}
          theme={theme}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              ...contentStyle,
            }}
          >
            {icon && !loading ? (
              <div
                style={iconContainerStyle}
                data-testid={`${testID}-icon-container`}
              >
                <Icon
                  source={icon}
                  size={customLabelSize ?? iconSize}
                  color={
                    typeof customLabelColor === "string"
                      ? customLabelColor
                      : textColor
                  }
                />
              </div>
            ) : null}
            {loading ? (
              <ActivityIndicator
                size={customLabelSize ?? iconSize}
                color={
                  typeof customLabelColor === "string"
                    ? customLabelColor
                    : textColor
                }
                style={iconContainerStyle}
              />
            ) : null}
            <Text
              variant="labelLarge"
              style={{
                margin: compact ? "0 8px" : "0 16px",
                textTransform: uppercase ? "uppercase" : "none",
                textAlign: "center",
                ...textStyle,
              }}
              data-testid={`${testID}-text`}
            >
              {children}
            </Text>
          </div>
        </TouchableRipple>
      </Surface>
    );
  }
);

export default Button;
