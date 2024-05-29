import { cn } from "@/lib/utils";
import { motion, type MotionProps } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";
import { Children, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { RectSliderType, RevealType, TabType } from "./types";
import Utils from "./utils";

type RootProps = { children: ReactNode; defaultSelected?: string };
const Root = ({ children, defaultSelected = "" }: RootProps) => {
  const [reveals, setReveals] = useState<RevealType>({ reveals: [], index: 0, pastIndex: 0 });
  const { position, update } = Utils.usePositions();

  const toggleReveal = (i: number) => {
    setReveals((prev) => {
      const newReveals = new Array(prev.reveals.length).fill(false);
      newReveals[i] = !prev.reveals[i];
      return { reveals: newReveals, index: i, pastIndex: prev.index };
    });
  };

  useLayoutEffect(() => {
    const defaultSelectedIndex = Utils.lookupValues.has(defaultSelected) ? Utils.lookupValues.get(defaultSelected) : 0;
    const initialReveals = Utils.buildReveals({ size: Utils.lookupValues.size, trueAt: defaultSelectedIndex });
    setReveals((prev) => ({ ...prev, reveals: initialReveals }));
  }, []);

  const AugmentedChildren = useMemo(() => {
    return Children.map(children, (child) => {
      if (!Utils.validAndHasProps(child)) return child;
      const childType = Utils.getComponentDisplayName(child) as TabType;
      /**
       *
       */
      switch (childType) {
        case "TabNav": {
          const navChildren = Children.map(child.props.children, (navChild, i) => {
            const name = navChild.type.name;
            if (!Utils.validAndHasProps(navChild)) return navChild;

            switch (name) {
              case "TabTrigger": {
                const { children, value, selected } = navChild.props;
                if (!value) return navChild;

                selected && setReveals((prev) => ({ ...prev, index: i }));
                const userOnclick = navChild.props.onClick;
                Utils.lookupValues.set(value, i);
                const getSelected = (value: string) => reveals.reveals[Utils.lookupValues.get(value) || 0];
                const onClick = () => {
                  toggleReveal(i);
                  userOnclick && userOnclick();
                };

                return (
                  <TabTrigger {...navChild.props} getSelected={getSelected} updatePos={update} onClick={onClick}>
                    {children}
                  </TabTrigger>
                );
              }
              case "TabSlider": {
                return <TabSlider {...navChild.props} positions={position.slider} reveals={reveals} />;
              }
            }
          });

          return <TabNav {...child.props}>{navChildren}</TabNav>;
        }

        case "TabContent": {
          const getSelected = (value: string) => reveals.reveals[Utils.lookupValues.get(value) || 0];
          return (
            <TabContent value={child.props.value} getSelected={getSelected}>
              {child.props.children}
            </TabContent>
          );
        }

        default:
          return child;
      }
    });
  }, [reveals, children]);

  return <>{AugmentedChildren}</>;
};

Root.displayName = "Tabs";

interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  value: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  getSelected?: (value: string) => boolean;
  updatePos?: ReturnType<typeof Utils.usePositions>["update"];
}

const TabTrigger = ({ children, value, onClick, className, getSelected, updatePos, ...props }: TabTriggerProps) => {
  const selected = getSelected?.(value) || false;
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selected && updatePos) updatePos({ ref, target: "slider" });
  }, [selected]);

  const handleOnCLick = () => {
    if (updatePos) updatePos({ ref, target: "slider" });
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
  getSelected?: (value: string) => boolean;
}

const TabContent = ({ children, value, getSelected }: TabContentProps) => {
  const selected = getSelected?.(value) || false;

  return <>{selected && <>{children}</>}</>;
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

interface TabSliderProps extends MotionProps {
  className?: string;
  reveals?: RevealType;
  positions?: RectSliderType;
}
const TabSlider = ({ className, reveals, positions, ...props }: TabSliderProps) => {
  return (
    <motion.div
      initial={Utils.getValueOrDefault(positions?.past)}
      animate={Utils.getValueOrDefault(positions?.current)}
      transition={Utils.transition}
      data-index={reveals?.index}
      className={cn("absolute h-7 bg-selected rounded-md pointer-events-none", className)}
      {...props}></motion.div>
  );
};

TabSlider.displayName = "TabSlider";

const Tabs = {
  Root,
  Trigger: TabTrigger,
  Content: TabContent,
  Nav: TabNav,
  Slider: TabSlider,
} as const;

export default Tabs;
