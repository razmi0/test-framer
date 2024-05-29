import type { ComponentType, FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { isValidElement, useState } from "react";
import { PositionsType } from "./types";

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

const lookupValues = new Map<string, number>();

const defaultInitial = {
  past: { left: 0, top: 0, width: 0, height: 0 },
  current: { left: 0, top: 0, width: 0, height: 0 },
};

const usePositions = (initial: PositionsType = defaultInitial) => {
  const [positions, setPositions] = useState<PositionsType>(initial);

  const update = (elementRef: React.RefObject<HTMLButtonElement> | null) => {
    const element = elementRef?.current;
    if (!element) return;
    const newValues = {
      left: element.offsetLeft,
      width: element.offsetWidth,
      height: element.offsetHeight,
      top: element.offsetTop,
    };
    setPositions((prev) => ({ past: prev.current, current: newValues }));
  };

  return { position: positions, update };
};

const Utils = {
  getComponentDisplayName,
  validAndHasProps,
  buildReveals,
  lookupValues,
  usePositions,
};

export default Utils;
