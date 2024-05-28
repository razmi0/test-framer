import type { ComponentType, FunctionComponent, PropsWithChildren, ReactElement, ReactNode, RefObject } from "react";
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

export type RevealType = {
  reveals: boolean[];
  index: number;
  pastIndex: number;
};
type TabContextType = {
  getSelected: (value: string) => boolean;
  reveals: RevealType;
};

type PositionType = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type PositionsType = {
  past: PositionType;
  current: PositionType;
  update: (elementRef: RefObject<HTMLButtonElement> | null) => void;
};
const positions: PositionsType = {
  past: { left: 0, top: 0, width: 0, height: 0 },
  current: { left: 0, top: 0, width: 0, height: 0 },
  update: function (elementRef: RefObject<HTMLButtonElement> | null) {
    const element = elementRef?.current;
    if (!element) return;
    const newValues = {
      left: element.offsetLeft,
      width: element.offsetWidth,
      height: element.offsetHeight,
      top: element.offsetTop,
    };
    this.past = this.current;
    this.current = newValues;
  },
};

const animateVars = {
  timingFunction: "cubic-bezier(.69,.28,.75,1.22)",
  duration: "0.150s",
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

let clickedFirst = false;

const Utils = {
  getComponentDisplayName,
  validAndHasProps,
  buildReveals,
  TabsContext,
  lookupValues,
  clonedChildren,
  useTabsContext,
  positions,
  animateVars,
  clickedFirst,
};

export default Utils;
