import Demo from "./components/Demo";
import Section from "./components/ui/Section";

const App = () => {
  return (
    <Section className="relative flex flex-col items-center justify-start p-32 gap-8">
      <Demo.Button />
    </Section>
  );
};

export default App;
