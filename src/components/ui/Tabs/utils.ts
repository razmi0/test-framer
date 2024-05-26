import type { ComponentType, FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { createContext, isValidElement } from "react";

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

const TabsContext = createContext<Record<"get", (value: string) => boolean>>({ get: () => false });

let clonedChildren: ReactNode;
const lookupValues = new Map<string, number>();

const Utils = {
  getComponentDisplayName,
  validAndHasProps,
  buildReveals,
  TabsContext,
  lookupValues,
  clonedChildren,
};

export default Utils;
