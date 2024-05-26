import Section from "./components/Section";
import Tabs, { TabContent, TabNav, TabTrigger } from "./components/ui/Tabs/Tabs";

function App() {
  return (
    <>
      <div />
      <Section className="grid place-content-center">
        <Tabs>
          <TabNav>
            <TabTrigger selected value="tab-1">
              Tab 1
            </TabTrigger>
            <TabTrigger value="tab-2">Tab 2</TabTrigger>
            {/* <TabTrigger value="tab-3">Tab 2</TabTrigger> */}
            {/* <TabTrigger value="tab-4">Tab 2</TabTrigger> */}
          </TabNav>
          <TabContent value="tab-1">Content 1</TabContent>
          <TabContent value="tab-2">Content 2</TabContent>
          {/* <TabContent value="tab-3">Content 3</TabContent> */}
          {/* <TabContent value="tab-4">Content 4</TabContent> */}
        </Tabs>
      </Section>
    </>
  );
}

export default App;
