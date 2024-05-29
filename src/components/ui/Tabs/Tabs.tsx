import { cn } from "@/lib/utils";
import { cubicBezier, motion, type MotionProps } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";
import { Children, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { RevealType } from "./utils";
import Utils from "./utils";

type PositionType = {
  left: number;
  top: number;
  width: number;
  height: number;
};
type PositionsType = {
  past: PositionType;
  current: PositionType;
};

const defaultInitial = {
  past: { left: 0, top: 0, width: 0, height: 0 },
  current: { left: 0, top: 0, width: 0, height: 0 },
};

const usePositions = (initial: PositionsType = defaultInitial) => {
  const [positions, setPositions] = useState<PositionsType>(initial);

  const update = (elementRef: React.RefObject<HTMLButtonElement> | null) => {
    const element = elementRef?.current;
    if (!element) return;
    const newValues = {
      left: element.offsetLeft,
      width: element.offsetWidth,
      height: element.offsetHeight,
      top: element.offsetTop,
    };
    setPositions((prev) => ({ past: prev.current, current: newValues }));
  };

  return { position: positions, update };
};

type TabType = ("TabNav" | "TabContent" | "TabTrigger" | "TabSlider" | "Tabs") & string;
const Root = ({ children, defaultSelected = "" }: { children: ReactNode; defaultSelected?: string }) => {
  const [reveals, setReveals] = useState<RevealType>({ reveals: [], index: 0, pastIndex: 0 });
  const { position, update } = usePositions();

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
      /** */
      switch (childType) {
        case "TabNav": {
          const navChildren = Children.map(child.props.children, (navChild, i) => {
            const name = navChild.type.name;
            console.log(navChild.props.id);
            if (!Utils.validAndHasProps(navChild)) return navChild;

            switch (name) {
              case "TabTrigger": {
                const { children, value, selected } = navChild.props;
                if (!value) return navChild;

                selected && setReveals((prev) => ({ ...prev, index: i }));
                const userOnclick = navChild.props.onClick;
                Utils.lookupValues.set(value, i);
                const getSelected = (value: string) => reveals.reveals[Utils.lookupValues.get(value) || 0];

                return (
                  <TabTrigger
                    {...navChild.props}
                    getSelected={getSelected}
                    updatePos={update}
                    onClick={() => {
                      toggleReveal(i);
                      userOnclick && userOnclick();
                    }}>
                    {children}
                  </TabTrigger>
                );
              }
              case "TabSlider": {
                return <TabSlider {...navChild.props} positions={position} reveals={reveals} />;
              }
            }
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
  updatePos?: (elementRef: React.RefObject<HTMLButtonElement> | null) => void;
}

const TabTrigger = ({ children, value, onClick, className, getSelected, updatePos, ...props }: TabTriggerProps) => {
  const selected = getSelected?.(value) || false;
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selected) updatePos?.(ref);
  }, [selected]);

  const handleOnCLick = () => {
    updatePos?.(ref);
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
  className?: string;
  getSelected?: (value: string) => boolean;
}

const TabContent = ({ children, value, className, getSelected, ...props }: TabContentProps) => {
  const selected = getSelected?.(value) || false;
  return (
    <>
      {selected && (
        <div {...props} data-selected={selected} data-value={value} className={cn("", className)}>
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

interface TabSliderProps extends MotionProps {
  className?: string;
  reveals?: RevealType;
  positions?: PositionsType;
}
const TabSlider = ({ className, reveals, positions, ...props }: TabSliderProps) => {
  const initial = {
    left: positions?.past.left || 0,
    top: positions?.past.top || 0,
    width: positions?.past.width || 0,
    height: positions?.past.height || 0,
  };

  const animate = {
    left: positions?.current.left || 0,
    top: positions?.current.top || 0,
    width: positions?.current.width || 0,
    height: positions?.current.height || 0,
  };

  const transition = {
    duration: 0.15,
    ease: cubicBezier(0.69, 0.28, 0.75, 1.22),
  };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      data-index={reveals?.index}
      className={cn("absolute h-7 bg-selected rounded-md pointer-events-none", className)}
      {...props}></motion.div>
  );
};

TabSlider.displayName = "TabSlider";

const Tabs = {
  Root,
  TabTrigger,
  TabContent,
  TabNav,
  TabSlider,
} as const;

export default Tabs;
