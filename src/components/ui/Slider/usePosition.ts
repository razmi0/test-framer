import type { PositionType, PositionsType, UpdateProps, UsePositionHook } from "@/components/ui/Tabs/types";
import { useState } from "react";

const defaultInitial: PositionsType = {
  past: { left: 0, top: 0, width: 0, height: 0 },
  current: { left: 0, top: 0, width: 0, height: 0 },
};

const usePosition: UsePositionHook = (initial) => {
  const [rectSlider, setRectSlider] = useState<PositionsType>(initial?.initSliderRect || defaultInitial);

  const update = ({ ref, firstChild = false }: UpdateProps) => {
    const element = firstChild ? (ref?.current?.firstElementChild as HTMLElement) : ref?.current;
    if (!element) return;
    const newValues = {
      left: element.offsetLeft,
      width: element.offsetWidth,
      height: element.offsetHeight,
      top: element.offsetTop,
    };

    setRectSlider((prev) => ({ past: prev.current, current: newValues }));
  };

  return { position: { slider: rectSlider }, update };
};

export const getValueOrDefault = (position: PositionType | undefined) => {
  return position ? position : { left: 0, top: 0, width: 0, height: 0 };
};

export default usePosition;
