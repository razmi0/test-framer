import { motion } from "framer-motion";
import type { ReactNode } from "react";

const Pill = ({ children }: { children: ReactNode }) => {
  return <motion.div>{children}</motion.div>;
};

export default Pill;
