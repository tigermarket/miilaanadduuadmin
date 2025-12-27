// adduwebui/components/ListSection.tsx
"use client";
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import type { ThemeProp } from "../../types";
import ListSubheader from "./ListSubheader";

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Title text for the section */
  title?: string;
  /** Content of the section */
  children: React.ReactNode;
  /** @optional */
  theme?: ThemeProp;
  /** Style passed to Title element */
  titleStyle?: React.CSSProperties;
  /** Style passed to container */
  style?: React.CSSProperties;
};

/**
 * A component used to group list items.
 *
 * ## Usage
 * ```tsx
 * import * as React from "react";
 * import ListSection from "./ListSection";
 * import ListSubheader from "./ListSubheader";
 *
 * const MyComponent = () => (
 *   <ListSection title="Some title">
 *     <ListSubheader>Subheader</ListSubheader>
 *     <div>First Item</div>
 *     <div>Second Item</div>
 *   </ListSection>
 * );
 * export default MyComponent;
 * ```
 */
const ListSection = ({
  children,
  title,
  titleStyle,
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  return (
    <div
      {...rest}
      style={{
        marginTop: 8,
        marginBottom: 8,
        ...style,
      }}
    >
      {title ? (
        <ListSubheader style={titleStyle} theme={theme}>
          {title}
        </ListSubheader>
      ) : null}
      {children}
    </div>
  );
};

ListSection.displayName = "List.Section";

export default ListSection;
