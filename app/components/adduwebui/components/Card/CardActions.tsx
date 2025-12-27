// adduwebui/components/CardActions.tsx
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import type { ThemeProp } from "../../types";
import type { CardActionChildProps } from "./utils";

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Items inside the CardActions */
  children: React.ReactNode;
  style?: React.CSSProperties;
  theme?: ThemeProp;
};

/**
 * A component to show a list of actions inside a Card.
 *
 * ## Usage
 * ```tsx
 * import * as React from "react";
 * import { CardActions } from "./CardActions";
 * import Button from "../Button";
 *
 * const MyComponent = () => (
 *   <div>
 *     <CardActions>
 *       <Button>Cancel</Button>
 *       <Button>Ok</Button>
 *     </CardActions>
 *   </div>
 * );
 * export default MyComponent;
 * ```
 */
const CardActions = ({ theme, style, children, ...rest }: Props) => {
  useInternalTheme(theme);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 8,
    ...style,
  };

  return (
    <div {...rest} style={containerStyle}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement<CardActionChildProps>(child)) {
          return child;
        }

        const compact = child.props.compact;
        const mode =
          child.props.mode ?? (index === 0 ? "outlined" : "contained");
        const childStyle: React.CSSProperties = {
          marginLeft: 8,
          ...child.props.style,
        };

        return React.cloneElement(child, {
          ...child.props,
          compact,
          mode,
          style: childStyle,
        });
      })}
    </div>
  );
};

CardActions.displayName = "Card.Actions";

export default CardActions;
export { CardActions };
