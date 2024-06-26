import { cn, format } from "@/lib/utils";
import { Power } from "lucide-react";
import { useState, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import Buttons from "./ui/Buttons/Buttons";
import Slider from "./ui/Slider/Slider";
import Tabs from "./ui/Tabs/Tabs";

export type ActiveType = { value: string; showColor: boolean };

const sliderStyle = "bg-selected rounded-md ring-1 ring-inset ring-neutral-900/80 border border-neutral-100/20";
const values = ["urophylia", "lupus", "erotomania", "dyslexia"];

const DemoTabs = () => {
  const [active, setActive] = useState<ActiveType>({ value: values[0], showColor: false });

  const toggleShowColor = () => setActive((p) => ({ ...p, showColor: !p.showColor }));
  const assignValue = (value: string) => setActive((p) => ({ ...p, value }));

  return (
    <>
      <Tabs.Root defaultSelected={values[2]}>
        <Tabs.Nav className="flex">
          {values.map((value, i) => (
            <Tabs.Trigger key={i} value={value} onClick={() => assignValue(value)}>
              {format(value)}
            </Tabs.Trigger>
          ))}
          <Slider className={sliderStyle} />
        </Tabs.Nav>
        {values.map((value, i) => (
          <Tabs.Content key={i} value={value}>
            <div className="p-4 text-white bg-neutral-900/80 rounded-lg">{format(value)}</div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
      <div className="py-2 w-full">
        <ModeToggle active={active} onClick={toggleShowColor} />
      </div>
    </>
  );
};

interface ModeToggleProps extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
  active: ActiveType;
}
const ModeToggle = ({ className, children, active, ...props }: ModeToggleProps) => {
  const { showColor, value } = active;
  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    if ("onClick" in props) props.onClick?.(e);
  };
  return (
    <button {...props} onClick={toggle} type="button" className={cn(showColor ? `text-${value} w-fit` : "", className)}>
      <Power />
      {children}
    </button>
  );
};

const DemoButton = () => {
  return (
    <Buttons.Group className="flex ">
      <Buttons.Button>Button 1</Buttons.Button>
      <Buttons.Button defaultSelected>Button 2</Buttons.Button>
      <Buttons.Button>Button 3</Buttons.Button>
      <Buttons.Button>Button 4</Buttons.Button>
      <Slider className={sliderStyle} />
    </Buttons.Group>
  );
};

const Demo = {
  Tabs: DemoTabs,
  Button: DemoButton,
};

export default Demo;
