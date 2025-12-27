// adduwebui/components/ListAccordionGroup.tsx
"use client";
import * as React from "react";

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Function to execute on selection change */
  onAccordionPress?: (expandedId: string | number) => void;
  /** Id of the currently expanded list accordion */
  expandedId?: string | number;
  /** React elements containing list accordions */
  children: React.ReactNode;
};

export type ListAccordionGroupContextType = {
  expandedId: string | number | undefined;
  onAccordionPress: (expandedId: string | number) => void;
} | null;

export const ListAccordionGroupContext =
  React.createContext<ListAccordionGroupContextType>(null);

/**
 * List.AccordionGroup allows control of a group of List Accordions.
 * `id` prop for each List.Accordion is required for the group to work.
 * At most one Accordion can be expanded at a time.
 *
 * ## Usage
 * ```tsx
 * import * as React from "react";
 * import ListAccordionGroup from "./ListAccordionGroup";
 * import ListAccordion from "./ListAccordion";
 * import ListItem from "./ListItem";
 *
 * const MyComponent = () => (
 *   <ListAccordionGroup>
 *     <ListAccordion title="Accordion 1" id="1">
 *       <ListItem title="Item 1" />
 *     </ListAccordion>
 *     <ListAccordion title="Accordion 2" id="2">
 *       <ListItem title="Item 2" />
 *     </ListAccordion>
 *   </ListAccordionGroup>
 * );
 * export default MyComponent;
 * ```
 */
const ListAccordionGroup = ({
  expandedId: expandedIdProp,
  onAccordionPress,
  children,
  ...rest
}: Props) => {
  const [expandedId, setExpandedId] = React.useState<
    string | number | undefined
  >(undefined);

  const onAccordionPressDefault = (newExpandedId: string | number) => {
    setExpandedId((currentExpandedId) =>
      currentExpandedId === newExpandedId ? undefined : newExpandedId
    );
  };

  return (
    <div {...rest}>
      <ListAccordionGroupContext.Provider
        value={{
          expandedId: expandedIdProp ?? expandedId, // controlled or uncontrolled
          onAccordionPress: onAccordionPress ?? onAccordionPressDefault,
        }}
      >
        {children}
      </ListAccordionGroupContext.Provider>
    </div>
  );
};

ListAccordionGroup.displayName = "List.AccordionGroup";

export default ListAccordionGroup;
