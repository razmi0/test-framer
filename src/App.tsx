import Section from "./components/ui/Section";
import DemoTabs from "./components/ui/Tabs/Demo";

const App = () => {
  return (
    <Section className="relative flex flex-col items-center justify-start p-32 gap-8">
      <DemoTabs />
    </Section>
  );
};

export default App;
