// adduwebui/components/ListAccordion.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import type { ThemeProp } from "../../types";
import MaterialCommunityIcon from "../MaterialCommunityIcon";
import TouchableRipple from "../TouchableRipple/TouchableRipple";
import Text from "../Typography/Text";
import { ListAccordionGroupContext } from "./ListAccordionGroup";
import type { ListChildProps, Style } from "./utils";
import { getAccordionColors, getLeftStyles } from "./utils";

export type Props = {
  title: React.ReactNode;
  description?: React.ReactNode;
  left?: (props: { color: string; style: Style }) => React.ReactNode;
  right?: (props: { isExpanded: boolean }) => React.ReactNode;
  expanded?: boolean;
  onPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  onLongPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  delayLongPress?: number;
  children: React.ReactNode;
  theme?: ThemeProp;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  rippleColor?: string;
  titleNumberOfLines?: number;
  descriptionNumberOfLines?: number;
  titleMaxFontSizeMultiplier?: number;
  descriptionMaxFontSizeMultiplier?: number;
  id?: string | number;
  testID?: string;
  accessibilityLabel?: string;
};

const ListAccordion = ({
  left,
  right,
  title,
  description,
  children,
  theme: themeOverrides,
  titleStyle,
  descriptionStyle,
  titleNumberOfLines = 1,
  descriptionNumberOfLines = 2,
  rippleColor: customRippleColor,
  style,
  containerStyle,
  contentStyle,
  id,
  testID,
  onPress,
  onLongPress,
  expanded: expandedProp,
  accessibilityLabel,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const [expanded, setExpanded] = React.useState<boolean>(
    expandedProp || false
  );

  const handlePressAction = (e: React.MouseEvent | React.TouchEvent) => {
    onPress?.(e);
    if (expandedProp === undefined) {
      setExpanded((prev) => !prev);
    }
  };

  const expandedInternal = expandedProp !== undefined ? expandedProp : expanded;
  const groupContext = React.useContext(ListAccordionGroupContext);

  if (groupContext !== null && !id) {
    throw new Error(
      "List.Accordion is used inside a List.AccordionGroup without specifying an id prop."
    );
  }

  const isExpanded = groupContext
    ? groupContext.expandedId === id
    : expandedInternal;

  const { descriptionColor, titleTextColor, rippleColor } = getAccordionColors({
    theme,
    isExpanded,
    customRippleColor,
  });

  const handlePress =
    groupContext && id !== undefined
      ? () => groupContext.onAccordionPress(id)
      : handlePressAction;

  return (
    <div>
      <TouchableRipple
        style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 24, ...style }}
        onClick={handlePress}
        onContextMenu={(e) => {
          e.preventDefault();
          onLongPress?.(e);
        }}
        rippleColor={rippleColor}
        role="button"
        aria-expanded={isExpanded}
        aria-label={accessibilityLabel}
        data-testid={testID}
        theme={theme}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 6,
            marginBottom: 6,
            ...containerStyle,
          }}
        >
          {left
            ? left({
                color: isExpanded ? theme.colors?.primary : descriptionColor,
                style: getLeftStyles(false, description, true),
              })
            : null}
          <div
            style={{
              paddingLeft: 16,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              ...contentStyle,
            }}
          >
            <Text
              numberOfLines={titleNumberOfLines}
              style={{
                fontSize: 16,
                color: titleTextColor,
                ...titleStyle,
              }}
              maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
            >
              {title}
            </Text>
            {description ? (
              <Text
                numberOfLines={descriptionNumberOfLines}
                style={{
                  fontSize: 14,
                  color: descriptionColor,
                  ...descriptionStyle,
                }}
                maxFontSizeMultiplier={descriptionMaxFontSizeMultiplier}
              >
                {description}
              </Text>
            ) : null}
          </div>
          <div style={{ marginLeft: 8, display: "flex", alignItems: "center" }}>
            {right ? (
              right({ isExpanded })
            ) : (
              <MaterialCommunityIcon
                name={isExpanded ? "chevron-up" : "chevron-down"}
                color={descriptionColor}
                size={24}
              />
            )}
          </div>
        </div>
      </TouchableRipple>

      {isExpanded
        ? React.Children.map(children, (child) => {
            if (
              left &&
              React.isValidElement<ListChildProps>(child) &&
              !child.props.left &&
              !child.props.right
            ) {
              return React.cloneElement(child, {
                style: { paddingLeft: 40, ...child.props.style },
                theme,
              });
            }
            return child;
          })
        : null}
    </div>
  );
};

ListAccordion.displayName = "List.Accordion";

export default ListAccordion;
