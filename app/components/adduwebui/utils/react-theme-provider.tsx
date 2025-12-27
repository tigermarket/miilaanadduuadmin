import * as React from "react";

// Recursive DeepPartial type used internally instead of importing from a separate file
type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T | undefined;

type ThemeContextValue<T> = {
  theme: T;
};

function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item);
}

function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  if (!isObject(source)) {
    return source as any as T;
  }

  const output: any = { ...(target as any) };

  for (const key of Object.keys(source as any)) {
    const sourceValue = (source as any)[key];
    const targetValue = (target as any)[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      output[key] = deepMerge(targetValue, sourceValue as any);
    } else {
      output[key] = sourceValue as any;
    }
  }

  return output as T;
}

export function createTheming<T>(defaultTheme: T) {
  const ThemeContext = React.createContext<ThemeContextValue<T>>({
    theme: defaultTheme,
  });

  const ThemeProvider: React.FC<{
    theme?: T | DeepPartial<T>;
    children?: React.ReactNode;
  }> = ({ theme, children }) => {
    const merged = React.useMemo(() => {
      if (!theme) return defaultTheme;
      return deepMerge(defaultTheme, theme as DeepPartial<T>) as unknown as T;
    }, [theme]);

    return (
      <ThemeContext.Provider value={{ theme: merged }}>
        {children}
      </ThemeContext.Provider>
    );
  };

  function useTheme<U = T>(overrides?: DeepPartial<U>) {
    const ctx = React.useContext(ThemeContext as any) as ThemeContextValue<U>;
    if (!overrides) return ctx.theme as U;
    return deepMerge(ctx.theme as any, overrides as any) as U;
  }

  function withTheme<Props extends { theme?: T }, C>(
    WrappedComponent: React.ComponentType<Props> & C
  ) {
    const ComponentWithTheme = (
      props: Omit<Props, "theme"> & { theme?: DeepPartial<T> }
    ) => {
      const theme = useTheme(props.theme as any);
      return <WrappedComponent {...(props as any)} theme={theme as any} />;
    };

    return ComponentWithTheme as unknown as React.ComponentType<Props> & C;
  }

  return {
    ThemeProvider,
    withTheme,
    useTheme,
  };
}

export type $DeepPartial<T> = DeepPartial<T>;

export default createTheming;
