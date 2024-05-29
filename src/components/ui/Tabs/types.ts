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

export type TabType = ("TabNav" | "TabContent" | "TabTrigger" | "TabSlider" | "Tabs") & string;
