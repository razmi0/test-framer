import Section from "./components/Section";
import Tabs, { TabContent, TabNav, TabSlider, TabTrigger } from "./components/ui/Tabs/Tabs";
import { cn } from "./lib/utils";

const values = ["urophylia", "lupus", "erotomania", "dyslexia"];
const format = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const App = () => {
  return (
    <Section className="grid place-content-center">
      <Tabs>
        <TabNav className="flex-col">
          {values.map((value, i) => (
            <TabTrigger key={i} value={value}>
              {format(value)}
            </TabTrigger>
          ))}
          <TabSlider
            className={cn("ring-1 ring-offset-1 ring-offset-transparent transition-all ring-inset ring-neutral-100/20")}
          />
        </TabNav>
        {values.map((value, i) => (
          <TabContent key={i} value={value}>
            <div className={`flex items-center justify-center h-full w-full py-3 px-5 bg-${value} rounded-md`}>
              <p className="text-center text-neutral-100 font-bold">{format(value)}</p>
            </div>
          </TabContent>
        ))}
      </Tabs>
    </Section>
  );
};

export default App;
