import { Power } from "lucide-react";
import { HTMLAttributes, MouseEvent, ReactNode, useState } from "react";
import Section from "./components/Section";
import Background from "./components/ui/Background";
import Tabs, { TabContent, TabNav, TabSlider, TabTrigger } from "./components/ui/Tabs/Tabs";
import { cn } from "./lib/utils";

const values = ["urophylia", "lupus", "erotomania", "dyslexia"];
const format = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
type ActiveType = { value: string; showColor: boolean };
const App = () => {
  const [active, setActive] = useState<ActiveType>({ value: values[0], showColor: false });

  const toggleShow = () => setActive((p) => ({ ...p, showColor: !p.showColor }));
  const assignValue = (value: string) => setActive((p) => ({ ...p, value }));

  return (
    <Section className="relative grid place-content-center gap-8">
      <Tabs>
        <TabNav className="flex">
          {values.map((value, i) => (
            <TabTrigger key={i} value={value} onClick={() => assignValue(value)}>
              {format(value)}
            </TabTrigger>
          ))}
          <TabSlider
            className={cn("ring-1 transition-all ring-inset ring-neutral-900/80 border border-neutral-100/20")}
          />
        </TabNav>
        {values.map((value, i) => (
          <TabContent key={i} value={value} className="z-10">
            <Panel active={active} />
          </TabContent>
        ))}
      </Tabs>
      <div className="py-2">
        <ModeToggle active={active} onClick={toggleShow} />
      </div>
      <Background type="mosaic" />
    </Section>
  );
};

type PanelProps = { active: ActiveType };
const Panel = ({ active }: PanelProps) => {
  const { value, showColor } = active;
  const borderColor = showColor ? `` : "border-neutral-100/20";
  return (
    <div
      style={{ borderColor: showColor ? `var(--color-${value})` : "" }}
      className={cn(
        `flex items-center justify-center h-[50vh] w-[50vw] py-3 px-5 border bg-stone-900 rounded-md z-10 shadow-sm shadow-black/80`,
        borderColor
      )}>
      <p className="text-center text-neutral-100 font-bold">{format(value)}</p>
    </div>
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
      <Power className="" />
      {children}
    </button>
  );
};
export default App;
