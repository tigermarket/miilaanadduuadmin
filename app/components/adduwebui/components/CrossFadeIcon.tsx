// adduwebui/components/CrossFadeIcon.tsx
"use client";
import * as React from "react";

import { useInternalTheme } from "../core/theming";
import type { ThemeProp } from "../types";
import Icon, { IconSource, isEqualIcon, isValidIcon } from "./Icon";

type Props = {
  /** Icon to display for the CrossFadeIcon */
  source: IconSource;
  /** Color of the icon */
  color: string;
  /** Size of the icon */
  size: number;
  /** TestID used for testing purposes */
  testID?: string;
  /** @optional */
  theme?: ThemeProp;
};

const CrossFadeIcon = ({
  color,
  size,
  source,
  theme: themeOverrides,
  testID = "cross-fade-icon",
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const [currentIcon, setCurrentIcon] = React.useState<IconSource>(source);
  const [previousIcon, setPreviousIcon] = React.useState<IconSource | null>(
    null
  );
  const [fade, setFade] = React.useState(1);

  const { scale } = theme.animation;

  // When source changes, set previous and current
  React.useEffect(() => {
    if (!isEqualIcon(currentIcon, source)) {
      setPreviousIcon(currentIcon);
      setCurrentIcon(source);
      setFade(1);
      // Animate fade out of previous
      const timeout = setTimeout(() => setFade(0), scale * 200);
      return () => clearTimeout(timeout);
    }
  }, [source, currentIcon, scale]);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {previousIcon && isValidIcon(previousIcon) ? (
        <div
          data-testid={`${testID}-previous`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: fade,
            transform: `rotate(${fade ? "0deg" : "-90deg"})`,
            transition: `opacity ${scale * 200}ms ease, transform ${
              scale * 200
            }ms ease`,
          }}
        >
          <Icon source={previousIcon} size={size} color={color} theme={theme} />
        </div>
      ) : null}
      <div
        data-testid={`${testID}-current`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: previousIcon ? 1 - fade : 1,
          transform: `rotate(${
            previousIcon ? (fade ? "0deg" : "-180deg") : "0deg"
          })`,
          transition: `opacity ${scale * 200}ms ease, transform ${
            scale * 200
          }ms ease`,
        }}
      >
        <Icon source={currentIcon} size={size} color={color} theme={theme} />
      </div>
    </div>
  );
};

export default CrossFadeIcon;
