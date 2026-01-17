// "use client";
// import * as React from "react";
// import type { CSSProperties } from "react";

// import { useInternalTheme } from "../../core/theming";
// import type { ThemeProp, MD3Type } from "../../types";
// import { forwardRef } from "../../utils/forwardRef";
// import type { VariantProp } from "./types";

// export type Props<T> = React.HTMLAttributes<HTMLSpanElement> & {
//   variant?: VariantProp<T>;
//   children: React.ReactNode;
//   theme?: ThemeProp;
//   style?: CSSProperties;
// };

// export type TextRef = React.ForwardedRef<{
//   setNativeProps(args: Record<string, unknown>): void;
// }>;

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

// const TextImpl = (
//   { style, variant, theme: initialTheme, children, ...rest }: Props<string>,
//   ref: TextRef
// ) => {
//   const root = React.useRef<HTMLSpanElement | null>(null);
//   const theme = useInternalTheme(initialTheme);
//   const writingDirection =
//     typeof document !== "undefined" && document.dir === "rtl" ? "rtl" : "ltr";

//   React.useImperativeHandle(ref, () => ({
//     // Minimal web-friendly shim: allow style updates via setNativeProps({ style: {...} })
//     setNativeProps: (args: Record<string, unknown>) => {
//       if (!root.current) return;
//       const nextStyle = (args as any)?.style as CSSProperties | undefined;
//       if (nextStyle) {
//         Object.assign(root.current.style, nextStyle);
//       }
//     },
//   }));

//   if (variant) {
//     const font = theme.fonts[variant];
//     if (typeof font !== "object") {
//       throw new Error(
//         `Variant ${variant} was not provided properly. Valid variants are ${Object.keys(
//           theme.fonts
//         ).join(", ")}.`
//       );
//     }

//     const variantStyle = toCssFromMD3Type(font);

//     return (
//       <span
//         ref={root}
//         dir={writingDirection}
//         style={{
//           ...variantStyle,
//           color: theme.colors.onSurface,
//           textAlign: "left",
//           ...style,
//         }}
//         {...rest}
//       >
//         {children}
//       </span>
//     );
//   }

//   const defaultFont = theme.fonts.bodyMedium;
//   const defaultStyle = toCssFromMD3Type(defaultFont);

//   return (
//     <span
//       {...rest}
//       ref={root}
//       dir={writingDirection}
//       style={{
//         ...defaultStyle,
//         color: theme.colors.onSurface,
//         textAlign: "left",
//         ...style,
//       }}
//     >
//       {children}
//     </span>
//   );
// };

// type TextComponent<T> = (
//   props: Props<T> & { ref?: React.RefObject<TextRef> }
// ) => React.JSX.Element;

// const Component = forwardRef(TextImpl) as TextComponent<never>;

// export const customText = <T,>() => Component as unknown as TextComponent<T>;
// export default Component;
"use client";
import * as React from "react";
import type { CSSProperties } from "react";

import { useInternalTheme } from "../../core/theming";
import type { ThemeProp, MD3Type } from "../../types";
import { forwardRef } from "../../utils/forwardRef";
import type { VariantProp } from "./types";
import { useTranslations } from "next-intl";
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
export type Props<T> = React.HTMLAttributes<HTMLElement> & {
  as?: HTMLElementTag; // h1, h2, p, span, etc.
  variant?: VariantProp<T>;
  children: React.ReactNode;
  theme?: ThemeProp;
  style?: CSSProperties;
  className?: string; // Tailwind classes
};

export type TextRef = React.ForwardedRef<{
  setNativeProps(args: Record<string, unknown>): void;
}>;

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

const TextImpl = (
  {
    as: Component = "span",
    style,
    className,
    variant,
    theme: initialTheme,
    children,
    ...rest
  }: Props<string>,
  ref: TextRef
) => {
  const root = React.useRef<HTMLElement | null>(null);
  const theme = useInternalTheme(initialTheme);
  const writingDirection =
    typeof document !== "undefined" && document.dir === "rtl" ? "rtl" : "ltr";

  React.useImperativeHandle(ref, () => ({
    setNativeProps: (args: Record<string, unknown>) => {
      if (!root.current) return;
      const nextStyle = (args as any)?.style as CSSProperties | undefined;
      if (nextStyle) {
        Object.assign(root.current.style, nextStyle);
      }
    },
  }));

  const font = variant ? theme.fonts[variant] : theme.fonts.bodyMedium;
  if (variant && typeof font !== "object") {
    throw new Error(
      `Variant ${variant} was not provided properly. Valid variants are ${Object.keys(
        theme.fonts
      ).join(", ")}.`
    );
  }

  const variantStyle = toCssFromMD3Type(font);
  const t = useTranslations();
  const content = typeof children === "string" ? t(children) : children;
  return (
    <Component
      // ref={root}
      dir={writingDirection}
      style={{
        ...variantStyle,
        color: theme.colors.onSurface,
        textAlign: "left",
        ...style,
      }}
      // className={className}

      {...rest}
      className="text-red-600 font-semibold text-lg"
    >
      {content}
    </Component>
  );
};

type TextComponent<T> = (
  props: Props<T> & { ref?: React.RefObject<TextRef> }
) => React.JSX.Element;

const Component = forwardRef(TextImpl) as TextComponent<never>;

export const CustomText = <T,>() => Component as unknown as TextComponent<T>;
export default Component;
