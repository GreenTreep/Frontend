// src/components/AnimatedSection.jsx

import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = ({
  children,
  className,
  initial = { opacity: 0, y: 40 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 1 },
}) => {
  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      transition={transition}
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
