import Background from "./components/ui/Background";
import Section from "./components/ui/Section";

const App = () => {
  return (
    <Section className="relative flex flex-col items-center justify-start p-32 gap-8">
      <Background type="mosaic" />
    </Section>
  );
};

export default App;
