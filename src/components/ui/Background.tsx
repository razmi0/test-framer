import { forwardRef } from "react";

type BackgroundType =
  | "charcoal-smudge"
  | "mathematics"
  | "dots"
  | "snow"
  | "dust"
  | "speckles"
  | "grunge"
  | "squares"
  | "lines"
  | "stars"
  | "math"
  | "wood"
  | "cotton"
  | "mosaic"
  | "cubes"
  | "paper-fibers"
  | "denim"
  | "paper"
  | "pinstripe"
  | "diag";
interface BackgroundProps {
  className?: string;
  type: BackgroundType;
  extension?: string;
}

const Background = forwardRef<HTMLImageElement, BackgroundProps>(
  ({ className, extension = "png", type, ...rest }, ref) => {
    return (
      // <div>
      <img
        ref={ref}
        aria-hidden="true"
        src={`./${type}.${extension}`}
        alt=""
        className={`pointer-events-none fixed inset-0 bottom-0 left-0 right-0 top-0 -z-0 min-h-full min-w-full overflow-x-hidden overflow-y-hidden bg-fore/10 opacity-5 ${className}`}
        {...rest}
      />
      // </div>
    );
  }
);

export default Background;
