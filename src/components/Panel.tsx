import type { ActiveType } from "@/App";
import { cn } from "@/lib/utils";

type PanelProps = { active: ActiveType; children: React.ReactNode };
const Panel = ({ active, children }: PanelProps) => {
  const { value, showColor } = active;
  const borderColor = showColor ? `` : "border-neutral-100/20";
  return (
    <div
      style={{ borderColor: showColor ? `var(--color-${value})` : "" }}
      className={cn(
        `flex items-center justify-center h-[50vh] w-[50vw] py-3 px-5 border bg-stone-900 rounded-md z-10 shadow-sm shadow-black/80`,
        borderColor
      )}>
      <div className="text-center text-neutral-100 font-bold">{children}</div>
    </div>
  );
};

export default Panel;
