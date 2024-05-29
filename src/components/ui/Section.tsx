type SizeType = "sm" | "md" | "lg" | "full";
type ExtensionType = "none" | "sm" | "md" | "lg" | "xl";

type SectionProps = {
  children: React.ReactNode;
  size?: SizeType;
  extension?: ExtensionType;
  className?: string;
};

const sizes = {
  sm: "25vh",
  md: "50vh",
  lg: "75vh",
  full: "100vh",
};

const extensions = {
  none: "0px",
  sm: "100px",
  md: "200px",
  lg: "400px",
  xl: "800px",
};

const Section = ({ children, size = "full", extension = "none", className = "" }: SectionProps) => {
  const height = `calc(${sizes[size]} + ${extensions[extension]})`;
  return (
    <section className={`w-screen ${className}`} style={{ height: height }}>
      {children}
    </section>
  );
};

export default Section;
