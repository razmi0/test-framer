import Section from "./components/Section";
import Tabs, { TabContent, TabNav, TabTrigger } from "./components/ui/Tabs/Tabs";

function App() {
  return (
    <>
      <div />
      <Section className="grid place-content-center">
        <Tabs>
          <TabNav>
            <TabTrigger value="urophylia">Urophylia</TabTrigger>
            <TabTrigger value="lupus">Lupus</TabTrigger>
            <TabTrigger value="erotomania">Erotomania</TabTrigger>
            <TabTrigger selected value="mythomania">
              Mythomania
            </TabTrigger>
          </TabNav>
          <TabContent value="urophylia">
            <div className="h-16 w-16 bg-cyan-600"></div>
          </TabContent>
          <TabContent value="lupus">
            <div className="h-16 w-16 bg-red-700"></div>
          </TabContent>
          <TabContent value="erotomania">
            <div className="h-16 w-16 bg-green-800"></div>
          </TabContent>
          <TabContent value="mythomania">
            <div className="h-16 w-16 bg-yellow-900"></div>
          </TabContent>
        </Tabs>
      </Section>
    </>
  );
}

export default App;
