import { cn } from "@/lib/utils";
import type { FC, ReactNode } from "react";
import { Children, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { RevealType } from "./utils";
import Utils from "./utils";

type TabType = "TabNav" | "TabContent" | "TabTrigger" | ("Tabs" & string);
let hasDefaultSelected = false;
const Tabs = ({ children }: { children: ReactNode }) => {
  const [reveals, setReveals] = useState<RevealType>({ reveals: [], index: 0, pastIndex: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);

  const toggleReveal = (i: number) => {
    setReveals((prev) => {
      const newReveals = new Array(prev.reveals.length).fill(false);
      newReveals[i] = !prev.reveals[i];
      return { reveals: newReveals, index: i, pastIndex: prev.index };
    });
  };

  useEffect(() => {
    // -- augmenting children
    // --
    let defaultSelected = 0;
    Utils.clonedChildren = Children.map(children, (child) => {
      if (!Utils.validAndHasProps(child)) return child;
      const childType = Utils.getComponentDisplayName(child) as TabType;
      switch (childType) {
        case "TabNav": {
          const tabChildrens = child.props.children as FC<TabTriggerProps>;
          const navChildren = Children.map(tabChildrens, (trigger, i) => {
            if (!Utils.validAndHasProps(trigger)) return trigger;

            const { children, value, selected } = trigger.props;

            if (!value) return trigger;

            selected && (defaultSelected = i);
            hasDefaultSelected = true;
            const toggle = () => {
              toggleReveal(i);
            };
            Utils.lookupValues.set(value, i);

            return (
              <TabTrigger {...trigger.props} onClick={toggle}>
                {children}
              </TabTrigger>
            );
          });

          return <TabNav {...child.props}>{navChildren}</TabNav>;
        }
        case "TabContent": {
          return child;
        }
        default:
          return child;
      }
    });
    // -- initialize reveals
    // --
    setReveals({
      reveals: Utils.buildReveals({ size: Utils.lookupValues.size, trueAt: defaultSelected }),
      index: defaultSelected,
      pastIndex: defaultSelected,
    });

    return () => {
      Utils.lookupValues.clear();
      Utils.clonedChildren = null;
    };
  }, []);

  const RevealProvider = useMemo(() => {
    return ({ children }: { children: ReactNode }) => {
      const getSelected = (value: string) => reveals.reveals[Utils.lookupValues.get(value) || 0];
      return <Utils.TabsContext.Provider value={{ getSelected, reveals }}>{children}</Utils.TabsContext.Provider>;
    };
  }, [reveals, Utils.lookupValues]);

  return (
    <RevealProvider>
      <div ref={tabsRef} className="flex flex-col-reverse items-center justify-center">
        {Utils.clonedChildren}
      </div>
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
  const { getSelected } = Utils.useTabsContext();
  const selected = getSelected(value);
  const ref = useRef<HTMLButtonElement>(null);

  const setPositions = () => {
    const left = ref.current?.offsetLeft || 0;
    const width = ref.current?.offsetWidth || 0;

    Utils.positions.past = Utils.positions.current;
    Utils.positions.current = { left, width };
  };

  const handleOnCLick = () => {
    setPositions();
    onClick && onClick();
  };

  useLayoutEffect(() => {
    if (selected) {
      setPositions();
      console.log(value);
    }
  }, []);

  return (
    <button
      ref={ref}
      key={value}
      data-selected={selected}
      onClick={handleOnCLick}
      data-value={value}
      className={cn(
        "relative text-sm font-normal px-5 py-1 text-white transition-all ring-offset-transparent rounded-lg",
        "hover:bg-neutral-900",
        "data-[selected=false]:text-neutral-500/50 hover:data-[selected=false]:text-neutral-500",
        "active:ring-2 active:ring-offset-2 active:ring-neutral-800"
      )}>
      {children}
    </button>
  );
};

TabTrigger.displayName = "TabTrigger";

type TabContentProps = {
  children: ReactNode;
  value: string;
};
const TabContent = ({ children, value }: TabContentProps) => {
  const selected = Utils.useTabsContext().getSelected(value);
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
  const navRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const paddings = "px-[8px] py-1";
  const [positions, setPositions] = useState(Utils.positions);

  useEffect(() => {
    console.log("positions", positions);
    setPositions(Utils.positions);
  }, [Utils.positions]);

  return (
    <>
      <style>
        {`
        .slide {
          animation: slide 0.3s cubic-bezier(.69,.28,.75,1.22) forwards;
          left: ${positions.current.left}px;
          width: ${positions.current.width}px;

        }
        
        @keyframes slide {
          0% {
            left: ${positions.past.left}px;
            width: ${positions.past.width}px;
          }
          100% {
            left: ${positions.current.left}px;
            width: ${positions.current.width}px;
          }
        }
      `}
      </style>
      <div className={cn(`relative flex gap-3 items-center justify-center rounded-md`, paddings)} ref={navRef}>
        {children}
        <div
          ref={sliderRef}
          className={cn(`absolute bg-selected h-7 rounded-md pointer-events-none slide`, paddings)}></div>
      </div>
    </>
  );
};

TabNav.displayName = "TabNav";

export default Tabs;
export { TabContent, TabNav, TabTrigger };
