import type { ComponentType, FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { createContext, isValidElement, useContext } from "react";

const getComponentDisplayName = (element: ReactElement<any>) => {
  const node = element as ReactElement<ComponentType<any>>;
  const type = (node as unknown as ReactElement<FunctionComponent>).type;
  const displayName =
    typeof type === "function"
      ? (type as FunctionComponent).displayName || (type as FunctionComponent).name || "Unknown"
      : type;
  return displayName;
};

const validAndHasProps = (child: unknown): child is ReactElement<any> => {
  return isValidElement(child) && (child.props as PropsWithChildren<any>);
};

const buildReveals = ({ size, trueAt }: { size: number; trueAt?: number | null }) => {
  const reveals = new Array(size).fill(false);
  if (typeof trueAt === "number" && (trueAt >= 0 || trueAt < reveals.length)) reveals[trueAt] = true;
  return reveals;
};
export type Spacing = {
  gap: number;
  widths: {
    width: number;
    height: number;
  }[];
};
export type RevealType = {
  reveals: boolean[];
  index: number;
  pastIndex: number;
};
type TabContextType = {
  getSelected: (value: string) => boolean;
  reveals: RevealType;
};

const positions = {
  past: { left: 0, width: 0 },
  current: { left: 0, width: 0 },
};
const TabsContext = createContext<TabContextType>({
  getSelected: () => false,
  reveals: { reveals: [], index: 0, pastIndex: 0 },
});

const useTabsContext = () => {
  const tabsContext = useContext(TabsContext);
  return tabsContext;
};

let clonedChildren: ReactNode;
const lookupValues = new Map<string, number>();

const Utils = {
  getComponentDisplayName,
  validAndHasProps,
  buildReveals,
  TabsContext,
  lookupValues,
  clonedChildren,
  useTabsContext,
  positions,
};

export default Utils;
