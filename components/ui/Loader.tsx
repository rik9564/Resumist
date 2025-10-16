import React from 'react';
// FIX: Import Transition type from framer-motion
import { motion, Transition } from 'framer-motion';

const loaderContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const dotVariants = {
  start: {
    y: '0%',
  },
  end: {
    y: '-100%',
  },
};

// FIX: Explicitly type dotTransition with the Transition type.
const dotTransition: Transition = {
  duration: 0.4,
  repeat: Infinity,
  repeatType: 'mirror',
  ease: 'easeInOut',
};

export const Loader = () => {
  return (
    <motion.div
      variants={loaderContainerVariants}
      initial="start"
      animate="end"
      className="flex justify-center items-end h-10 gap-2"
    >
      <motion.span
        className="block w-4 h-4 bg-cyan-400 rounded-full"
        variants={dotVariants}
        transition={dotTransition}
      />
      <motion.span
        className="block w-4 h-4 bg-cyan-400 rounded-full"
        variants={dotVariants}
        transition={dotTransition}
      />
      <motion.span
        className="block w-4 h-4 bg-cyan-400 rounded-full"
        variants={dotVariants}
        transition={dotTransition}
      />
    </motion.div>
  );
};
