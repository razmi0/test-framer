import Section from "./components/Section";
import Tabs, { TabContent, TabNav, TabSlider, TabTrigger } from "./components/ui/Tabs/Tabs";
import { cn } from "./lib/utils";

const values = ["urophylia", "lupus", "erotomania", "dyslexia"];
const format = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const App = () => {
  return (
    <Section className="relative grid place-content-center">
      <Tabs>
        <TabNav className="flex-col">
          {values.map((value, i) => (
            <TabTrigger key={i} value={value}>
              {format(value)}
            </TabTrigger>
          ))}
          <Slider />
        </TabNav>
        {values.map((value, i) => (
          <TabContent key={i} value={value}>
            <Panel value={value} />
          </TabContent>
        ))}
      </Tabs>
      <svg className="pointer-events-none fixed inset-0 bottom-0 left-0 right-0 top-0 -z-50 min-h-full min-w-full overflow-x-hidden overflow-y-hidden bg-white/10 opacity-5">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="4" stitchTiles="stitch"></feTurbulence>
          <feColorMatrix type="saturate" values="0"></feColorMatrix>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)"></rect>
      </svg>
    </Section>
  );
};

const Slider = () => {
  return (
    <TabSlider className={cn("ring-1 transition-all ring-inset ring-neutral-900/80 border border-neutral-100/20")} />
  );
};

const Panel = ({ value }: { value: string }) => {
  return (
    <div
      className={`flex items-center justify-center h-[50vh] w-[50vw] py-3 px-5 ring-1 border border-neutral-100/20 ring-${value} bg-fore rounded-md`}>
      <p className="text-center text-neutral-100 font-bold">{format(value)}</p>
    </div>
  );
};
export default App;
