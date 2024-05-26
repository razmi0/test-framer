import { cn } from "@/lib/utils";
import { Children, FC, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Noise from "./Noise";
import Utils from "./utils";

const Tabs = ({ children }: { children: ReactNode }) => {
  const [reveals, setReveals] = useState<boolean[]>([]);

  const toggleReveal = (i: number) => {
    setReveals((prev) => {
      const newReveals = new Array(prev.length).fill(false);
      newReveals[i] = !prev[i];
      return newReveals;
    });
  };

  useEffect(() => {
    // -- augmenting children
    // --
    let defaultSelected = 0;
    Utils.clonedChildren = Children.map(children, (child) => {
      if (!Utils.validAndHasProps(child)) return child;
      if (Utils.getComponentDisplayName(child) !== "TabNav") return child;
      // -- TabNav
      // --
      const tabChildrens = child.props.children as FC<TabTriggerProps>;
      const navChildren = Children.map(tabChildrens, (trigger, i) => {
        if (!Utils.validAndHasProps(trigger)) return trigger;

        const { children, value, selected } = trigger.props;

        if (!value) return trigger;

        selected && (defaultSelected = i);
        const toggle = () => toggleReveal(i);
        Utils.lookupValues.set(value, i);

        return (
          <TabTrigger {...trigger.props} onClick={toggle}>
            {children}
          </TabTrigger>
        );
      });

      return <TabNav {...child.props}>{navChildren}</TabNav>;
    });
    // -- initialize reveals
    // --
    setReveals(Utils.buildReveals({ size: Utils.lookupValues.size, trueAt: defaultSelected }));

    return () => {
      Utils.lookupValues.clear();
      Utils.clonedChildren = null;
    };
  }, [children]);

  const RevealProvider = useMemo(() => {
    return ({ children }: { children: ReactNode }) => {
      return (
        <Utils.TabsContext.Provider value={{ get: (value: string) => reveals[Utils.lookupValues.get(value) || 0] }}>
          {children}
        </Utils.TabsContext.Provider>
      );
    };
  }, [reveals, Utils.lookupValues]);

  return (
    <RevealProvider>
      <div className="flex flex-col-reverse items-center justify-center">{Utils.clonedChildren}</div>
    </RevealProvider>
  );
};

Tabs.displayName = "Tabs";

type TabTriggerProps = {
  children: ReactNode;
  value: string;
  onClick?: () => void;
  selected?: boolean;
};
const TabTrigger = ({ children, value, onClick }: TabTriggerProps) => {
  const selected = useContext(Utils.TabsContext).get(value);

  return (
    <button
      data-selected={selected}
      onClick={onClick}
      data-value={value}
      className={cn(
        "relative text-sm font-normal px-5 py-1 mx-2 text-white transition-all ring-offset-transparent rounded-lg",
        "hover:bg-neutral-900",
        "data-[selected=true]:bg-selected data-[selected=false]:text-neutral-500/50",
        "active:ring-2 active:ring-offset-2 active:ring-neutral-800"
      )}>
      {children}
      <Noise color={"rgb(115 115 115)"} />
    </button>
  );
};

TabTrigger.displayName = "TabTrigger";

type TabContentProps = {
  children: ReactNode;
  value: string;
};
const TabContent = ({ children, value }: TabContentProps) => {
  const selected = useContext(Utils.TabsContext).get(value);
  return (
    <>
      {selected && (
        <div data-selected={selected} data-value={value} className="mt-8">
          {children}
        </div>
      )}
    </>
  );
};

TabContent.displayName = "TabContent";

const TabNav = ({ children }: { children: ReactNode }) => {
  return <div className="flex gap-3 items-center justify-center rounded-md px-5 py-2">{children}</div>;
};

TabNav.displayName = "TabNav";

export default Tabs;
export { TabContent, TabNav, TabTrigger };
