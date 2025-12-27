// adduwebui/components/ListImage.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import type { ThemeProp } from "../../types";

export type Props = {
  source: string; // URL or data URI for web
  variant?: "image" | "video";
  style?: React.CSSProperties;
  /** @optional */
  theme?: ThemeProp;
};

/**
 * A component to show image in a list item.
 *
 * ## Usage
 * ```tsx
 * import * as React from "react";
 * import ListImage from "./ListImage";
 *
 * const MyComponent = () => (
 *   <>
 *     <ListImage variant="image" source="https://www.someurl.com/apple" />
 *     <ListImage variant="video" source="/assets/some-apple.png" />
 *   </>
 * );
 * export default MyComponent;
 * ```
 */
const ListImage = ({
  style,
  source,
  variant = "image",
  theme: themeOverrides,
}: Props) => {
  useInternalTheme(themeOverrides);

  const getStyles = (): React.CSSProperties => {
    if (variant === "video") {
      return { width: 114, height: 64, marginLeft: 0, ...style };
    }
    return { width: 56, height: 56, ...style };
  };

  return (
    <img src={source} style={getStyles()} alt="" data-testid="list-image" />
  );
};

ListImage.displayName = "List.Image";

export default ListImage;
