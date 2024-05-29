import usePosition from "@/hooks/usePosition";
import { cn, getComponentDisplayName, validAndHasProps } from "@/lib/utils";
import { Children, MouseEvent, useMemo, useRef, type HTMLAttributes, type ReactNode } from "react";
import Slider from "./Slider";

const ButtonGroup = ({ children, className }: { children: ReactNode; className?: string }) => {
  const { update, position } = usePosition();
  const AugmentedButtons = useMemo(() => {
    return Children.map(children, (child) => {
      if (!validAndHasProps(child)) return child;
      const childType = getComponentDisplayName(child);

      switch (childType) {
        case "Button":
          return (
            <Button {...child.props} updatePosition={update}>
              {child}
            </Button>
          );

        case "Slider":
          return (
            <Slider {...child.props} position={position}>
              {child}
            </Slider>
          );
      }
    });
  }, [children]);

  return <div className={className}>{AugmentedButtons}</div>;
};

ButtonGroup.displayName = "ButtonGroup";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  updatePosition?: ReturnType<typeof usePosition>["update"];
}
const Button = ({ children, className, updatePosition, ...props }: ButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if ("onClick" in props) props.onClick?.(e);
    updatePosition && updatePosition({ ref });
  };
  return (
    <button {...props} onMouseDown={handleClick} ref={ref} className={cn("px-8 py-3", className)} type="button">
      {children}
    </button>
  );
};

Button.displayName = "Button";

const Root = {
  Group: ButtonGroup,
  Button,
};

export default Root;
