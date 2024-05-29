export type RevealType = {
  reveals: boolean[];
  index: number;
  pastIndex: number;
};

export type PositionType = {
  left: number;
  top: number;
  width: number;
  height: number;
};
export type PositionsType = {
  past: PositionType;
  current: PositionType;
};

export type UsePositionProps = {
  initSliderRect?: PositionsType;
  initContentRect?: PositionsType;
} | void;

export type UpdateProps = {
  ref: React.RefObject<HTMLElement> | null;
  firstChild?: boolean;
};

export type UsePositionHook = (initial: UsePositionProps) => {
  position: {
    slider: PositionsType;
  };
  update: ({ ref }: UpdateProps) => void;
};

export type RectSliderType = ReturnType<UsePositionHook>["position"]["slider"];

export type TabType = ("TabNav" | "TabContent" | "TabTrigger" | "TabSlider" | "Tabs") & string;
