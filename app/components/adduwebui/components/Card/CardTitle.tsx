// adduwebui/components/CardTitle.tsx
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import type { MD3TypescaleKey, ThemeProp } from "../../types";
import Text from "../Typography/Text";

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Text for the title */
  title: React.ReactNode;
  /** Style for the title */
  titleStyle?: React.CSSProperties;
  /** Number of lines for the title */
  titleNumberOfLines?: number;
  /** Title text variant */
  titleVariant?: keyof typeof MD3TypescaleKey;
  /** Subtitle text */
  subtitle?: React.ReactNode;
  /** Style for the subtitle */
  subtitleStyle?: React.CSSProperties;
  /** Number of lines for the subtitle */
  subtitleNumberOfLines?: number;
  /** Subtitle text variant */
  subtitleVariant?: keyof typeof MD3TypescaleKey;
  /** Left element renderer */
  left?: (props: { size: number }) => React.ReactNode;
  /** Style for the left element wrapper */
  leftStyle?: React.CSSProperties;
  /** Right element renderer */
  right?: (props: { size: number }) => React.ReactNode;
  /** Style for the right element wrapper */
  rightStyle?: React.CSSProperties;
  /** Max font size multiplier for title */
  titleMaxFontSizeMultiplier?: number;
  /** Max font size multiplier for subtitle */
  subtitleMaxFontSizeMultiplier?: number;
  style?: React.CSSProperties;
  theme?: ThemeProp;
};

const LEFT_SIZE = 40;

const CardTitle = ({
  title,
  titleStyle,
  titleNumberOfLines = 1,
  titleVariant = "bodyLarge",
  titleMaxFontSizeMultiplier,
  subtitle,
  subtitleStyle,
  subtitleNumberOfLines = 1,
  subtitleVariant = "bodyMedium",
  subtitleMaxFontSizeMultiplier,
  left,
  leftStyle,
  right,
  rightStyle,
  style,
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const minHeight = subtitle || left || right ? 72 : 50;
  const marginBottom = subtitle ? 0 : 2;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 16,
        minHeight,
        ...style,
      }}
    >
      {left ? (
        <div
          style={{
            justifyContent: "center",
            marginRight: 16,
            height: LEFT_SIZE,
            width: LEFT_SIZE,
            display: "flex",
            alignItems: "center",
            ...leftStyle,
          }}
        >
          {left({ size: LEFT_SIZE })}
        </div>
      ) : null}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {title && (
          <Text
            style={{
              minHeight: 30,
              paddingRight: 16,
              marginBottom,
              ...titleStyle,
            }}
            numberOfLines={titleNumberOfLines}
            variant={titleVariant}
            maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            style={{
              minHeight: 20,
              paddingRight: 16,
              margin: 0,
              ...subtitleStyle,
            }}
            numberOfLines={subtitleNumberOfLines}
            variant={subtitleVariant}
            maxFontSizeMultiplier={subtitleMaxFontSizeMultiplier}
          >
            {subtitle}
          </Text>
        )}
      </div>

      <div style={rightStyle}>{right ? right({ size: 24 }) : null}</div>
    </div>
  );
};

CardTitle.displayName = "Card.Title";

export default CardTitle;
export { CardTitle };
