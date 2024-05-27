import Section from "./components/Section";
import Tabs, { TabContent, TabNav, TabSlider, TabTrigger } from "./components/ui/Tabs/Tabs";
import { cn } from "./lib/utils";

const values = ["urophylia", "lupus", "erotomania", "mythomania", "dyslexia", "dyscalculia", "dysgraphia"];
const sliderRings = ["cyan-600", "red-700", "green-800", "yellow-900", "blue-600", "purple-700", "pink-800"].map(
  (color, i) => `data-[index='${i}']:ring-${color}`
);

const App = () => {
  return (
    <>
      <Section className="grid place-content-center">
        <Tabs>
          <TabNav>
            {values.map((value, i) => (
              <TabTrigger key={i} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </TabTrigger>
            ))}
            <TabSlider className={cn("ring-1 ring-offset-1 ring-offset-transparent", sliderRings)} />
          </TabNav>
          {values.map((value, i) => (
            <TabContent key={i} value={value}>
              <div className={`h-16 w-16 bg-${value}`}></div>
            </TabContent>
          ))}
        </Tabs>
      </Section>
    </>
  );
};

export default App;
