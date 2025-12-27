// adduwebui/components/Card.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import type { ThemeProp } from "../../types";
import { forwardRef } from "../../utils/forwardRef";
import hasTouchHandler from "../../utils/hasTouchHandler";
import { splitStyles } from "../../utils/splitStyles";
import Surface from "../Surface";
import CardActions from "./CardActions";
import CardContent from "./CardContent";
import CardCover from "./CardCover";
import CardTitle from "./CardTitle";
import { getCardColors } from "./utils";

type CardComposition = {
  Content: typeof CardContent;
  Actions: typeof CardActions;
  Cover: typeof CardCover;
  Title: typeof CardTitle;
};

type Mode = "elevated" | "outlined" | "contained";

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  mode?: Mode;
  children: React.ReactNode;
  onLongPress?: () => void;
  onPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  onPressIn?: (e: React.MouseEvent | React.TouchEvent) => void;
  onPressOut?: (e: React.MouseEvent | React.TouchEvent) => void;
  delayLongPress?: number;
  disabled?: boolean;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  contentStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  theme?: ThemeProp;
  testID?: string;
  accessible?: boolean;
};

const Card = (
  {
    elevation: cardElevation = 1,
    delayLongPress,
    onPress,
    onLongPress,
    onPressOut,
    onPressIn,
    mode: cardMode = "elevated",
    children,
    style,
    contentStyle,
    theme: themeOverrides,
    testID = "card",
    accessible,
    disabled,
    ...rest
  }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const theme = useInternalTheme(themeOverrides);
  const isMode = React.useCallback(
    (modeToCompare: Mode) => cardMode === modeToCompare,
    [cardMode]
  );

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const { roundness } = theme;
  const { backgroundColor, borderColor: themedBorderColor } = getCardColors({
    theme,
    mode: cardMode,
  });

  const flattenedStyles = style || {};
  const borderColor = (flattenedStyles as any).borderColor || themedBorderColor;

  const [, borderRadiusStyles] = splitStyles(
    flattenedStyles,
    (prop) => prop.startsWith("border") && prop.endsWith("Radius")
  );

  const borderRadiusCombinedStyles: React.CSSProperties = {
    borderRadius: 3 * roundness,
    ...borderRadiusStyles,
  };

  const total = React.Children.count(children);
  const siblings = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const type = child.type as any;
      if (typeof type === "string") {
        return type; // e.g. "p", "div"
      }
      return type?.displayName ?? null;
    }
    return null;
  });

  const content = (
    <div style={{ flexShrink: 1, ...contentStyle }} data-testid={testID}>
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              index,
              total,
              siblings,
              borderRadiusStyles,
            })
          : child
      )}
    </div>
  );

  return (
    <Surface
      ref={ref}
      style={{
        ...(isMode("elevated") ? {} : { backgroundColor }),
        ...borderRadiusCombinedStyles,
        ...style,
      }}
      theme={theme}
      elevation={isMode("elevated") ? cardElevation : 0}
      data-testid={`${testID}-container`}
      {...rest}
    >
      {isMode("outlined") && (
        <div
          data-testid={`${testID}-outline`}
          style={{
            borderColor,
            borderWidth: 1,
            borderStyle: "solid",
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 2,
            ...borderRadiusCombinedStyles,
          }}
        />
      )}

      {hasPassedTouchHandler ? (
        <div
          role={accessible ? "button" : undefined}
          onClick={onPress as any}
          onMouseDown={onPressIn as any}
          onMouseUp={onPressOut as any}
          onContextMenu={(e) => {
            e.preventDefault();
            onLongPress?.();
          }}
          style={{ cursor: disabled ? "default" : "pointer" }}
        >
          {content}
        </div>
      ) : (
        content
      )}
    </Surface>
  );
};

Card.displayName = "Card";
const Component = forwardRef(Card);

const CardComponent = Component as typeof Component & CardComposition;
CardComponent.Content = CardContent;
CardComponent.Actions = CardActions;
CardComponent.Cover = CardCover;
CardComponent.Title = CardTitle;

export default CardComponent;
