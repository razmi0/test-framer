import { Power } from "lucide-react";
import { HTMLAttributes, MouseEvent, ReactNode, useState } from "react";
import Section from "./components/Section";
import Background from "./components/ui/Background";
import Tabs, { TabContent, TabNav, TabSlider, TabTrigger } from "./components/ui/Tabs/Tabs";
import { cn } from "./lib/utils";

const values = ["urophylia", "lupus", "erotomania", "dyslexia"];
const format = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const App = () => {
  const [active, setActive] = useState(values[0]);
  const [showColor, setShowColor] = useState(false);

  const toggleShow = () => {
    console.log("toggleShow", showColor);
    setShowColor((p) => !p);
  };

  const assignValue = (value: string) => {
    console.log("assignValue", active, value);
    setActive(value);
  };
  return (
    <Section className="relative grid place-content-center">
      <Tabs>
        <TabNav className="flex-col">
          {values.map((value, i) => (
            <TabTrigger key={i} value={value} onClick={() => assignValue(value)}>
              {format(value)}
            </TabTrigger>
          ))}
          <Slider />
        </TabNav>
        {values.map((value, i) => (
          <TabContent key={i} value={value} className="z-10">
            <Panel active={active} show={showColor} />
          </TabContent>
        ))}
      </Tabs>
      <Background type="mosaic" />
      <ModeToggle active={active} show={showColor} onClick={toggleShow} />
    </Section>
  );
};

const Slider = () => {
  return (
    <TabSlider className={cn("ring-1 transition-all ring-inset ring-neutral-900/80 border border-neutral-100/20")} />
  );
};

const Panel = ({ active, show }: { active: string; show: boolean }) => {
  console.log("Panel", active);
  const color = show ? `ring-${active} ring-1` : "hh";

  console.log(color);

  return (
    <div
      className={cn(
        `flex items-center justify-center h-[50vh] w-[50vw] py-3 px-5 border border-neutral-100/20 bg-stone-900 rounded-md z-10 shadow-sm shadow-black/80`,
        show ? `ring-${active} ring-1` : ""
      )}>
      <p className="text-center text-neutral-100 font-bold">{format(active)}</p>
    </div>
  );
};

interface ModeToggleProps extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
  active: string;
  show: boolean;
}
const ModeToggle = ({ className, children, active, show, ...props }: ModeToggleProps) => {
  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    if ("onClick" in props) props.onClick?.(e);
  };
  return (
    <button {...props} type="button" className={cn(show ? `text-${active}` : "", className)} onClick={toggle}>
      <Power className="" />
      {children}
    </button>
  );
};
export default App;
