import { cubicBezier } from "framer-motion";
import type { ComponentType, FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { isValidElement, useState } from "react";
import { PositionType, PositionsType, UpdateProps, UsePositionHook } from "./types";

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

const defaultInitial: PositionsType = {
  past: { left: 0, top: 0, width: 0, height: 0 },
  current: { left: 0, top: 0, width: 0, height: 0 },
};

const targets = ["slider", "content"] as const;

const usePositions: UsePositionHook = (initial) => {
  const [rectSlider, setRectSlider] = useState<PositionsType>(initial?.initSliderRect || defaultInitial);
  const [rectContent, setRectContent] = useState<PositionsType>(initial?.initContentRect || defaultInitial);

  const update = ({ ref, target, firstChild = false }: UpdateProps) => {
    const element = firstChild ? (ref?.current?.firstElementChild as HTMLElement) : ref?.current;
    if (!element || !targets.includes(target)) {
      console.error(`Invalid target : ${target}. Valids are : ${targets.join(" ")}`);
      return;
    }
    const newValues = {
      left: element.offsetLeft,
      width: element.offsetWidth,
      height: element.offsetHeight,
      top: element.offsetTop,
    };

    switch (target) {
      case "slider":
        setRectSlider((prev) => ({ past: prev.current, current: newValues }));
        break;
      case "content":
        setRectContent((prev) => ({ past: prev.current, current: newValues }));
        break;
      default:
        console.error("Invalid target");
    }
  };

  return { position: { slider: rectSlider, content: rectContent }, update };
};

const getValueOrDefault = (position: PositionType | undefined) => {
  return position ? position : { left: 0, top: 0, width: 0, height: 0 };
};

const transition = {
  duration: 0.15,
  ease: cubicBezier(0.69, 0.28, 0.75, 1.22),
};

const Utils = {
  getComponentDisplayName,
  validAndHasProps,
  buildReveals,
  lookupValues,
  usePositions,
  transition,
  getValueOrDefault,
};

export default Utils;
