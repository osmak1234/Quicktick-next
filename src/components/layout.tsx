import { motion } from "framer-motion";
import React, { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <motion.div
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 300, opacity: 0 }}
    transition={{
      type: "just",
      // make it smooth
      ease: "easeInOut",
      // make it take longer
      duration: 0.5,
    }}
  >
    {children}
  </motion.div>
);

export default Layout;
