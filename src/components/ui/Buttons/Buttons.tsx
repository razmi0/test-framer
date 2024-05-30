import usePosition from "@/components/ui/Slider/usePosition";
import { cn, getComponentDisplayName, validAndHasProps } from "@/lib/utils";
import {
  Children,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";
import Slider from "../Slider/Slider";
// import { SelectedType } from "./types";

let buttonTemp: boolean[] = [];
let indexDefaulted: number | null = null;
const ButtonGroup = ({ children, className }: { children: ReactNode; className?: string }) => {
  const [selected, setSelected] = useState<boolean[]>([]);
  const { update, position } = usePosition();

  useEffect(() => console.log(selected), [selected]);

  const toggleSelected = (index: number) => {
    setSelected((prev) => {
      const temp = new Array(prev.length).fill(false);
      temp[index] = !temp[index];
      return temp;
    });
  };

  const ButtonHoc = ({ onClick, index, children, ...props }: any) => {
    const ref = useRef<HTMLButtonElement>(null);

    const handleOnClick = () => {
      toggleSelected(index);
      "onClick" in props && props.onClick();
    };

    return (
      <Button
        {...props}
        ref={ref}
        onClick={handleOnClick}
        updatePosition={update}
        selected={selected[index]}
        data-index={index}>
        {children}
      </Button>
    );
  };

  const SliderHoc = ({ children, ...props }: any) => {
    return (
      <Slider {...props} position={position}>
        {children}
      </Slider>
    );
  };

  const AugmentedButtons = useMemo(() => {
    buttonTemp = [];
    const hocs = Children.map(children, (child, i) => {
      if (!validAndHasProps(child)) return child;
      const childType = getComponentDisplayName(child);

      switch (childType) {
        case "Button": {
          buttonTemp.push(false);
          if (child.props.defaultSelected) indexDefaulted = i;

          return (
            <ButtonHoc {...child.props} index={i}>
              {child.props.children}
            </ButtonHoc>
          );
        }
        case "Slider": {
          return <SliderHoc {...child.props}>{child.props.children}</SliderHoc>;
        }

        default:
          return child;
      }
    });

    return hocs;
  }, [children, selected]);

  useEffect(() => {
    if (indexDefaulted) buttonTemp[indexDefaulted] = true;
    setSelected(buttonTemp);
  }, [children]);

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
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, updatePosition, selected, defaultSelected, ...props }, ref) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if ("onClick" in props) props.onClick?.(e);
      ref && updatePosition && updatePosition({ ref });
    };

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
  }
);

Button.displayName = "Button";

const Buttons = {
  Group: ButtonGroup,
  Button,
};

export default Buttons;
