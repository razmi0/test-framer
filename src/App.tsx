import { Power } from "lucide-react";
import { HTMLAttributes, MouseEvent, ReactNode, useState } from "react";
import Panel from "./components/Panel";
import Pill from "./components/Pill";
import Background from "./components/ui/Background";
import Section from "./components/ui/Section";
import Tabs from "./components/ui/Tabs/Tabs";
import { cn, format } from "./lib/utils";
import type { ActiveType } from "./types/types";

const values = ["urophylia", "lupus", "erotomania", "dyslexia"];

const App = () => {
  const [active, setActive] = useState<ActiveType>({ value: values[0], showColor: false });

  const toggleShowColor = () => setActive((p) => ({ ...p, showColor: !p.showColor }));
  const assignValue = (value: string) => setActive((p) => ({ ...p, value }));

  return (
    <Section className="relative flex flex-col items-center justify-start p-32 gap-8">
      <Tabs.Root defaultSelected={values[2]}>
        <Tabs.TabNav className="flex">
          {values.map((value, i) => (
            <Tabs.TabTrigger key={i} value={value} onClick={() => assignValue(value)}>
              {format(value)}
            </Tabs.TabTrigger>
          ))}
          <Tabs.TabSlider className={cn("ring-1 ring-inset ring-neutral-900/80 border border-neutral-100/20")} />
        </Tabs.TabNav>
        <Tabs.TabContent value={values[0]} className="z-10 grow">
          <Pill>
            <p className="text-neutral-100">Hello</p>
          </Pill>
        </Tabs.TabContent>
        <Tabs.TabContent value={values[1]} className="z-10 grow">
          <Panel active={active}>
            <p className="text-neutral-100">World</p>
          </Panel>
        </Tabs.TabContent>
        <Tabs.TabContent value={values[2]} className="z-10 grow">
          <Pill>
            <p className="text-neutral-100">World</p>
          </Pill>
        </Tabs.TabContent>
        <Tabs.TabContent value={values[3]} className="z-10 grow">
          <Panel active={active}>
            <p className="text-neutral-100">Hello</p>
          </Panel>
        </Tabs.TabContent>
      </Tabs.Root>
      <div className="py-2 w-full">
        <ModeToggle active={active} onClick={toggleShowColor} />
      </div>
      <Background type="mosaic" />
    </Section>
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
