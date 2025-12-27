// "use client";
// import * as React from "react";
// import type { CSSProperties } from "react";

// import { useInternalTheme } from "../../core/theming";
// import type { ThemeProp, MD3Type } from "../../types";
// import { forwardRef } from "../../utils/forwardRef";
// import type { VariantProp } from "./types";

// type Props<T> = React.HTMLAttributes<HTMLSpanElement> & {
//   variant?: VariantProp<T>;
//   style?: CSSProperties;
//   theme?: ThemeProp;
// };

// function toCssFromMD3Type(type: MD3Type): CSSProperties {
//   return {
//     fontFamily: type.fontFamily,
//     fontWeight: type.fontWeight,
//     fontStyle: type.fontStyle,
//     letterSpacing:
//       typeof type.letterSpacing === "number"
//         ? `${type.letterSpacing}px`
//         : type.letterSpacing,
//     lineHeight:
//       typeof type.lineHeight === "number"
//         ? `${type.lineHeight}px`
//         : type.lineHeight,
//     fontSize:
//       typeof type.fontSize === "number" ? `${type.fontSize}px` : type.fontSize,
//   };
// }

// // Web "AnimatedText": we keep the API and rely on CSS transitions/animations via style/className.
// // Consumers can pass transition properties (e.g., transition: 'opacity 150ms') or CSS classes.
// const AnimatedText = forwardRef<HTMLSpanElement, Props<never>>(
//   function AnimatedText(
//     { style, theme: themeOverrides, variant, ...rest },
//     ref
//   ) {
//     const theme = useInternalTheme(themeOverrides);
//     const writingDirection =
//       typeof document !== "undefined" && document.dir === "rtl" ? "rtl" : "ltr";

//     if (variant) {
//       const font = theme.fonts[variant];
//       if (typeof font !== "object") {
//         throw new Error(
//           `Variant ${variant} was not provided properly. Valid variants are ${Object.keys(
//             theme.fonts
//           ).join(", ")}.`
//         );
//       }

//       const variantStyle = toCssFromMD3Type(font);

//       return (
//         <span
//           ref={ref}
//           {...rest}
//           dir={writingDirection}
//           style={{
//             ...variantStyle,
//             color: theme.colors.onSurface,
//             textAlign: "left",
//             // Add your animation-related styles here (e.g., transition)
//             ...style,
//           }}
//         />
//       );
//     }

//     const defaultFont = theme.fonts.bodyMedium;
//     const defaultStyle = toCssFromMD3Type(defaultFont);

//     return (
//       <span
//         ref={ref}
//         {...rest}
//         dir={writingDirection}
//         style={{
//           ...defaultStyle,
//           color: theme.colors.onSurface,
//           textAlign: "left",
//           ...style,
//         }}
//       />
//     );
//   }
// );

// export const customAnimatedText = <T,>() =>
//   AnimatedText as (props: Props<T>) => React.JSX.Element;

// export default AnimatedText;
"use client";
import * as React from "react";
import type { CSSProperties } from "react";

import { useInternalTheme } from "../../core/theming";
import type { ThemeProp, MD3Type } from "../../types";
import { forwardRef } from "../../utils/forwardRef";
import type { VariantProp } from "./types";

// Restrict to common HTML text tags
type HTMLElementTag =
  | "span"
  | "p"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

type Props<T> = React.HTMLAttributes<HTMLElement> & {
  as?: HTMLElementTag; // ✅ semantic tag
  variant?: VariantProp<T>; // ✅ MD3 variant
  style?: CSSProperties; // ✅ inline style
  theme?: ThemeProp; // ✅ theme override
  className?: string; // ✅ Tailwind classes
};

function toCssFromMD3Type(type: MD3Type): CSSProperties {
  return {
    fontFamily: type.fontFamily,
    fontWeight: type.fontWeight,
    fontStyle: type.fontStyle,
    letterSpacing:
      typeof type.letterSpacing === "number"
        ? `${type.letterSpacing}px`
        : type.letterSpacing,
    lineHeight:
      typeof type.lineHeight === "number"
        ? `${type.lineHeight}px`
        : type.lineHeight,
    fontSize:
      typeof type.fontSize === "number" ? `${type.fontSize}px` : type.fontSize,
  };
}

const AnimatedText = forwardRef<HTMLElement, Props<never>>(
  function AnimatedText(
    {
      as: Component = "span",
      style,
      className,
      theme: themeOverrides,
      variant,
      ...rest
    },
    ref
  ) {
    const theme = useInternalTheme(themeOverrides);
    const writingDirection =
      typeof document !== "undefined" && document.dir === "rtl" ? "rtl" : "ltr";

    const font = variant ? theme.fonts[variant] : theme.fonts.bodyMedium;
    if (variant && typeof font !== "object") {
      throw new Error(
        `Variant ${variant} was not provided properly. Valid variants are ${Object.keys(
          theme.fonts
        ).join(", ")}.`
      );
    }

    const variantStyle = toCssFromMD3Type(font);

    return (
      <Component
        // ref={ref}
        {...rest}
        dir={writingDirection}
        style={{
          ...variantStyle,
          color: theme.colors.onSurface,
          textAlign: "left",
          ...style,
        }}
        className={className} // ✅ Tailwind classes applied
      />
    );
  }
);

export const customAnimatedText = <T,>() =>
  AnimatedText as (props: Props<T>) => React.JSX.Element;

export default AnimatedText;
