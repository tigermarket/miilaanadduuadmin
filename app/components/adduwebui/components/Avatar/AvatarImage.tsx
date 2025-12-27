// adduwebui/components/AvatarImage.tsx
import * as React from "react";
import { useInternalTheme } from "../../core/theming";
import type { ThemeProp } from "../../types";

const defaultSize = 64;

export type AvatarImageSource =
  | string // URL or data URI
  | ((props: { size: number }) => React.ReactNode);

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Image to display for the Avatar */
  source: AvatarImageSource;
  /** Size of the avatar */
  size?: number;
  style?: React.CSSProperties;
  /** Invoked on load error */
  onError?: React.ReactEventHandler<HTMLImageElement>;
  /** Invoked when load completes successfully */
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  /** @optional */
  theme?: ThemeProp;
  testID?: string;
};

const AvatarImage = ({
  size = defaultSize,
  source,
  style,
  onError,
  onLoad,
  theme: themeOverrides,
  testID,
  ...rest
}: Props) => {
  const { colors } = useInternalTheme(themeOverrides);
  const backgroundColor =
    style?.backgroundColor ?? colors?.primary ?? "#6200ee";

  return (
    <div
      {...rest}
      data-testid={testID}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {typeof source === "function" ? (
        source({ size })
      ) : (
        <img
          src={source}
          alt=""
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            objectFit: "cover",
          }}
          onError={onError}
          onLoad={onLoad}
        />
      )}
    </div>
  );
};

AvatarImage.displayName = "Avatar.Image";

export default AvatarImage;
