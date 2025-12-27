// adduwebui/components/CardCover.tsx
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import { grey200 } from "../../styles/themes/colors";
import type { ThemeProp } from "../../types";
import { splitStyles } from "../../utils/splitStyles";
import { getCardCoverStyle } from "./utils";

export type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** @internal */
  index?: number;
  /** @internal */
  total?: number;
  style?: React.CSSProperties;
  /** @optional */
  theme?: ThemeProp;
};

/**
 * A component to show a cover image inside a Card.
 *
 * ## Usage
 * ```tsx
 * import * as React from "react";
 * import { CardCover } from "./CardCover";
 *
 * const MyComponent = () => (
 *   <div>
 *     <CardCover src="https://picsum.photos/700" />
 *   </div>
 * );
 * export default MyComponent;
 * ```
 */
const CardCover = ({
  index,
  total,
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const flattenedStyles = style || {};
  const [, borderRadiusStyles] = splitStyles(
    flattenedStyles,
    (prop) => prop.startsWith("border") && prop.endsWith("Radius")
  );

  const coverStyle = getCardCoverStyle({
    theme,
    index,
    total,
    borderRadiusStyles,
  });

  return (
    <div
      style={{
        height: 195,
        backgroundColor: grey200,
        overflow: "hidden",
        ...coverStyle,
        ...style,
      }}
    >
      <img
        {...rest}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...coverStyle,
        }}
        alt=""
      />
    </div>
  );
};

CardCover.displayName = "Card.Cover";

export default CardCover;
export { CardCover };
