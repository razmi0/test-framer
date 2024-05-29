import { ActiveType } from "@/App";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const Pill = ({ children, active }: { children: ReactNode; active: ActiveType }) => {
  const { value, showColor } = active;
  const borderColor = showColor ? `` : "border-neutral-100/20";

  return (
    <motion.div
      style={{ borderColor: showColor ? `var(--color-${value})` : "" }}
      className={cn("py-5 px-8 border bg-stone-900 rounded-md z-10 shadow-sm shadow-black/80", borderColor)}>
      {children}
    </motion.div>
  );
};

export default Pill;
