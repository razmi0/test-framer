import usePosition, { getValueOrDefault } from "@/components/ui/Slider/usePosition";
import { cn } from "@/lib/utils";
import { cubicBezier, motion, type MotionProps } from "framer-motion";

export const transition = {
  duration: 0.15,
  ease: cubicBezier(0.69, 0.28, 0.75, 1.22),
};

interface SliderProps extends MotionProps {
  className?: string;
  position?: ReturnType<typeof usePosition>["position"];
}
const Slider = ({ className, position, ...props }: SliderProps) => {
  return (
    <motion.div
      initial={getValueOrDefault(position?.slider.past)}
      animate={getValueOrDefault(position?.slider.current)}
      transition={transition}
      className={cn("absolute pointer-events-none", className)}
      {...props}></motion.div>
  );
};

Slider.displayName = "Slider";

export default Slider;
