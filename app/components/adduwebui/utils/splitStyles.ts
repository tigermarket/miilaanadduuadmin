// adduwebui/utils/splitStyles.tsx
import type { CSSProperties } from "react";

type FiltersArray = readonly ((style: keyof CSSProperties) => boolean)[];

type MappedTuple<Tuple extends FiltersArray> = {
  [Index in keyof Tuple]: CSSProperties;
} & { length: Tuple["length"] };

type Style = CSSProperties[keyof CSSProperties];
type Entry = [keyof CSSProperties, Style];

/**
 * Utility function to extract styles in separate objects
 *
 * @param styles The style object you want to filter
 * @param filters The filters by which you want to split the styles
 * @returns An array of filtered style objects:
 * - The first style object contains the properties that didn't match any filter
 * - After that there will be a style object for each filter you passed in the same order as the matching filters
 * - A style property will exist in a single style object, the first filter it matched
 */
export function splitStyles<Tuple extends FiltersArray>(
  styles: CSSProperties,
  ...filters: Tuple
) {
  if (process.env.NODE_ENV !== "production" && filters.length === 0) {
    console.error("No filters were passed when calling splitStyles");
  }

  // Temporary arrays for each filter
  const newStyles = filters.map(() => [] as Entry[]);

  // Entries which match no filter
  const rest: Entry[] = [];

  // Iterate every style property
  outer: for (const item of Object.entries(styles) as Entry[]) {
    for (let i = 0; i < filters.length; i++) {
      if (filters[i](item[0])) {
        newStyles[i].push(item);
        continue outer;
      }
    }
    rest.push(item);
  }

  // Put unmatched styles in the beginning
  newStyles.unshift(rest);

  // Convert arrays of entries into objects
  return newStyles.map((styles) => Object.fromEntries(styles)) as unknown as [
    CSSProperties,
    ...MappedTuple<Tuple>
  ];
}
