// adduwebui/components/ListItem.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import type { EllipsizeProp, ThemeProp } from "../../types";
import { forwardRef } from "../../utils/forwardRef";
import TouchableRipple from "../TouchableRipple/TouchableRipple";
import Text from "../Typography/Text";
import { Style, getLeftStyles, getRightStyles } from "./utils";

type Title =
  | React.ReactNode
  | ((props: {
      selectable: boolean;
      ellipsizeMode?: EllipsizeProp;
      color: string;
      fontSize: number;
    }) => React.ReactNode);

type Description =
  | React.ReactNode
  | ((props: {
      selectable: boolean;
      ellipsizeMode?: EllipsizeProp;
      color: string;
      fontSize: number;
    }) => React.ReactNode);

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: Title;
  description?: Description;
  left?: (props: { color: string; style: Style }) => React.ReactNode;
  right?: (props: { color: string; style?: Style }) => React.ReactNode;
  onPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  theme?: ThemeProp;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  titleNumberOfLines?: number;
  descriptionNumberOfLines?: number;
  titleEllipsizeMode?: EllipsizeProp;
  descriptionEllipsizeMode?: EllipsizeProp;
  titleMaxFontSizeMultiplier?: number;
  descriptionMaxFontSizeMultiplier?: number;
  testID?: string;
};

const ListItem = (
  {
    left,
    right,
    title,
    description,
    onPress,
    theme: themeOverrides,
    style,
    containerStyle,
    contentStyle,
    titleStyle,
    titleNumberOfLines = 1,
    descriptionNumberOfLines = 2,
    titleEllipsizeMode,
    descriptionEllipsizeMode,
    descriptionStyle,
    descriptionMaxFontSizeMultiplier,
    titleMaxFontSizeMultiplier,
    testID,
    ...rest
  }: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const theme = useInternalTheme(themeOverrides);
  const [alignToTop, setAlignToTop] = React.useState(false);

  // On web we can approximate alignment by checking description length
  React.useEffect(() => {
    if (typeof description === "string") {
      setAlignToTop(description.split(" ").length > 10);
    }
  }, [description]);

  const renderDescription = (
    descriptionColor: string,
    description?: Description | null
  ) => {
    return typeof description === "function" ? (
      description({
        selectable: false,
        ellipsizeMode: descriptionEllipsizeMode,
        color: descriptionColor,
        fontSize: 14,
      })
    ) : description ? (
      <Text
        selectable={false}
        numberOfLines={descriptionNumberOfLines}
        ellipsizeMode={descriptionEllipsizeMode}
        style={{
          fontSize: 14,
          color: descriptionColor,
          ...descriptionStyle,
        }}
        maxFontSizeMultiplier={descriptionMaxFontSizeMultiplier}
      >
        {description}
      </Text>
    ) : null;
  };

  const renderTitle = () => {
    const titleColor = theme.colors.onSurface;
    return typeof title === "function" ? (
      title({
        selectable: false,
        ellipsizeMode: titleEllipsizeMode,
        color: titleColor,
        fontSize: 16,
      })
    ) : (
      <Text
        selectable={false}
        ellipsizeMode={titleEllipsizeMode}
        numberOfLines={titleNumberOfLines}
        style={{
          fontSize: 16,
          color: titleColor,
          ...titleStyle,
        }}
        maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
      >
        {title}
      </Text>
    );
  };

  const descriptionColor = theme.colors.onSurfaceVariant;

  return (
    <TouchableRipple
      {...rest}
      ref={ref}
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 24,
        ...style,
      }}
      onClick={onPress}
      theme={theme}
      data-testid={testID}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          marginTop: 6,
          marginBottom: 6,
          ...containerStyle,
        }}
      >
        {left
          ? left({
              color: descriptionColor,
              style: getLeftStyles(alignToTop, description, true),
            })
          : null}
        <div
          style={{
            paddingLeft: 16,
            flexShrink: 1,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            ...contentStyle,
          }}
          data-testid={`${testID}-content`}
        >
          {renderTitle()}
          {renderDescription(descriptionColor, description)}
        </div>
        {right
          ? right({
              color: descriptionColor,
              style: getRightStyles(alignToTop, description, true),
            })
          : null}
      </div>
    </TouchableRipple>
  );
};

ListItem.displayName = "List.Item";
const Component = forwardRef(ListItem);

export default Component;
