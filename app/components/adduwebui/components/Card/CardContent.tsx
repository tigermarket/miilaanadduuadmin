// adduwebui/components/CardContent.tsx
import * as React from "react";

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Items inside the Card.Content */
  children: React.ReactNode;
  /** @internal */
  index?: number;
  /** @internal */
  total?: number;
  /** @internal */
  siblings?: Array<string>;
  style?: React.CSSProperties;
};

const CardContent = ({
  index,
  total,
  siblings,
  style,
  children,
  ...rest
}: Props) => {
  const cover = "withInternalTheme(CardCover)";
  const title = "withInternalTheme(CardTitle)";

  let contentStyle: React.CSSProperties | undefined;
  let prev: string | undefined;
  let next: string | undefined;

  if (typeof index === "number" && siblings) {
    prev = siblings[index - 1];
    next = siblings[index + 1];
  }

  if (
    (prev === cover && next === cover) ||
    (prev === title && next === title) ||
    total === 1
  ) {
    contentStyle = styles.only;
  } else if (index === 0) {
    if (next === cover || next === title) {
      contentStyle = styles.only;
    } else {
      contentStyle = styles.first;
    }
  } else if (typeof total === "number" && index === total - 1) {
    if (prev === cover || prev === title) {
      contentStyle = styles.only;
    } else {
      contentStyle = styles.last;
    }
  } else if (prev === cover || prev === title) {
    contentStyle = styles.first;
  } else if (next === cover || next === title) {
    contentStyle = styles.last;
  }

  return (
    <div
      {...rest}
      style={{
        ...styles.container,
        ...contentStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

CardContent.displayName = "Card.Content";

const styles: Record<string, React.CSSProperties> = {
  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  first: {
    paddingTop: 16,
  },
  last: {
    paddingBottom: 16,
  },
  only: {
    paddingTop: 16,
    paddingBottom: 16,
  },
};

export default CardContent;
export { CardContent };
