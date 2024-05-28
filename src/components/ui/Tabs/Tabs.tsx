import { cn } from "@/lib/utils";
import type { FC, HTMLAttributes, ReactNode } from "react";
import { Children, useEffect, useRef, useState } from "react";
import type { RevealType } from "./utils";
import Utils from "./utils";

type TabType = "TabNav" | "TabContent" | "TabTrigger" | ("Tabs" & string);
const Tabs = ({ children, className }: { children: ReactNode; className?: string }) => {
  const [reveals, setReveals] = useState<RevealType>({ reveals: [], index: 0, pastIndex: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);

  const toggleReveal = (i: number) => {
    setReveals((prev) => {
      const newReveals = new Array(prev.reveals.length).fill(false);
      newReveals[i] = !prev.reveals[i];
      return { reveals: newReveals, index: i, pastIndex: prev.index };
    });
  };

  let defaultSelected = 0;

  useEffect(() => {
    setReveals({
      reveals: Utils.buildReveals({ size: Utils.lookupValues.size, trueAt: defaultSelected }),
      index: defaultSelected,
      pastIndex: defaultSelected,
    });
  }, []);

  const AugmentedChildren = () => {
    return Children.map(children, (child) => {
      if (!Utils.validAndHasProps(child)) return child;
      const childType = Utils.getComponentDisplayName(child) as TabType;
      switch (childType) {
        case "TabNav": {
          const tabChildrens = child.props.children as FC<TabTriggerProps>;
          const navChildren = Children.map(tabChildrens, (trigger, i) => {
            if (!Utils.validAndHasProps(trigger)) return trigger;
            const { children, value, selected } = trigger.props;
            if (!value) return trigger;

            selected && setReveals((prev) => ({ ...prev, index: i }));
            const userOnclick = trigger.props.onClick;
            Utils.lookupValues.set(value, i);
            const getSelected = (value: string) => reveals.reveals[Utils.lookupValues.get(value) || 0];

            return (
              <TabTrigger
                {...trigger.props}
                getSelected={getSelected}
                onClick={() => {
                  toggleReveal(i);
                  userOnclick && userOnclick();
                }}>
                {children}
              </TabTrigger>
            );
          });

          return <TabNav {...child.props}>{navChildren}</TabNav>;
        }

        case "TabContent": {
          const getSelected = (value: string) => reveals.reveals[Utils.lookupValues.get(value) || 0];
          return (
            <TabContent {...child.props} getSelected={getSelected}>
              {child.props.children}
            </TabContent>
          );
        }

        default:
          return child;
      }
    });
  };

  return (
    <div ref={tabsRef} className={cn("flex items-center justify-center", className)}>
      {AugmentedChildren()}
    </div>
  );
};

Tabs.displayName = "Tabs";

interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  value: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  getSelected?: (value: string) => boolean;
}

const TabTrigger = ({ children, value, onClick, className, getSelected, ...props }: TabTriggerProps) => {
  const selected = getSelected?.(value) || false;
  const ref = useRef<HTMLButtonElement>(null);

  const handleOnCLick = () => {
    Utils.positions.update(ref);
    Utils.clickedFirst = true;
    onClick && onClick();
  };

  return (
    <button
      ref={ref}
      key={value}
      data-selected={selected}
      onMouseDown={handleOnCLick}
      data-value={value}
      className={cn(
        "relative text-sm font-normal px-5 py-1 text-white transition-all ring-offset-transparent rounded-lg flex items-center justify-center",
        "data-[selected=false]:text-neutral-500/50 hover:data-[selected=false]:text-neutral-200/80",
        !Utils.clickedFirst && selected && "bg-selected",
        "active:ring-2 active:ring-offset-2 active:ring-neutral-800",
        className
      )}
      {...props}>
      {children}
    </button>
  );
};

TabTrigger.displayName = "TabTrigger";

interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value: string;
  className?: string;
  getSelected?: (value: string) => boolean;
}

const TabContent = ({ children, value, className, getSelected, ...props }: TabContentProps) => {
  const selected = getSelected?.(value) || false;
  return (
    <>
      {selected && (
        <div {...props} data-selected={selected} data-value={value} className={cn("mt-8", className)}>
          {children}
        </div>
      )}
    </>
  );
};

TabContent.displayName = "TabContent";

interface TabNavProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const TabNav = ({ children, className, ...props }: TabNavProps) => {
  return (
    <>
      <div
        className={cn(`relative flex-wrap flex gap-3 items-center justify-center rounded-md px-2 py-1`, className)}
        {...props}>
        {children}
      </div>
    </>
  );
};

TabNav.displayName = "TabNav";

interface TabSliderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}
const TabSlider = ({ className, ...props }: TabSliderProps) => {
  const { reveals } = Utils.useTabsContext();
  if (Utils.positions.current.width === 0) return <></>;
  return (
    <>
      <style>
        {`
        .slide {
          animation: slide ${Utils.animateVars.duration} ${Utils.animateVars.timingFunction} forwards;
        }
        
        @keyframes slide {
          0% {
            left: ${Utils.positions.past.left}px;
            top : ${Utils.positions.past.top}px;
            width: ${Utils.positions.past.width}px;
            height: ${Utils.positions.past.height}px;
          }
          100% {
            left: ${Utils.positions.current.left}px;
            top : ${Utils.positions.current.top}px;
            width: ${Utils.positions.current.width}px;
            height: ${Utils.positions.current.height}px;
          }
        }
      `}
      </style>
      <div
        data-index={reveals.index}
        className={cn("absolute h-7 bg-selected rounded-md pointer-events-none slide", className)}
        {...props}></div>
    </>
  );
};

TabSlider.displayName = "TabSlider";

export default Tabs;
export { TabContent, TabNav, TabSlider, TabTrigger };
