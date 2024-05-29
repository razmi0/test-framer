import usePosition from "@/components/ui/Slider/usePosition";
import { cn, getComponentDisplayName, validAndHasProps } from "@/lib/utils";
import {
  Children,
  MouseEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import Slider from "../Slider/Slider";
import { SelectedType } from "./types";

let buttonTemp: SelectedType[] = [];

const ButtonGroup = ({ children, className }: { children: ReactNode; className?: string }) => {
  const [selected, setSelected] = useState<SelectedType[]>([]);
  const { update, position } = usePosition();

  const toggleSelected = (index: number) => {
    const activeIndex = selected.findIndex((item) => item.index === index);
    if (activeIndex === -1) return;
    const newSelected = [...selected];
    newSelected[activeIndex].selected = !newSelected[activeIndex].selected;
    setSelected(newSelected);
  };

  const AugmentedButtons = useMemo(() => {
    buttonTemp = [];
    const hocs = Children.map(children, (child, i) => {
      if (!validAndHasProps(child)) return child;
      const childType = getComponentDisplayName(child);

      switch (childType) {
        case "Button": {
          if (selected?.[i].selected) {
            buttonTemp.push({ selected: true, index: i });
          } else {
            buttonTemp.push(selected[i]);
          }
          const onClick = () => {
            toggleSelected(i);
            child.props.onClick && child.props.onClick();
          };

          return (
            <Button
              {...child.props}
              onClick={onClick}
              updatePosition={update}
              data-index={i}
              selected={selected?.[i]?.selected || false}>
              {child.props.children}
            </Button>
          );
        }
        case "Slider": {
          return (
            <Slider {...child.props} position={position}>
              {child.props.children}
            </Slider>
          );
        }

        default:
          return child;
      }
    });

    return hocs;
  }, [children, position, selected]);

  useLayoutEffect(() => {
    setSelected(buttonTemp);
    console.log("buttonTemp", buttonTemp);
  }, []);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  return <div className={className}>{AugmentedButtons}</div>;
};

ButtonGroup.displayName = "ButtonGroup";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  updatePosition?: ReturnType<typeof usePosition>["update"];
  selected?: boolean;
  defaultSelected?: boolean;
}
const Button = ({ children, className, updatePosition, selected, defaultSelected, ...props }: ButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if ("onClick" in props) props.onClick?.(e);
    updatePosition && updatePosition({ ref });
  };

  useEffect(() => {
    updatePosition && updatePosition({ ref });
  }, []);

  return (
    <button
      {...props}
      onMouseDown={handleClick}
      data-selected={selected}
      ref={ref}
      className={cn(
        "relative text-sm font-normal px-5 py-1 text-white transition-all ring-offset-transparent rounded-lg flex items-center justify-center",
        "data-[selected=false]:text-neutral-500/50 hover:data-[selected=false]:text-neutral-200/80",
        "active:ring-2 active:ring-offset-2 active:ring-neutral-800",
        className
      )}
      type="button">
      {children}
    </button>
  );
};

Button.displayName = "Button";

const Buttons = {
  Group: ButtonGroup,
  Button,
};

export default Buttons;
