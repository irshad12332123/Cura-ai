import React from "react";
import { motion } from "motion/react";
function BlobAnimation({ x, y, scale, duration, positionStyles }) {
  return (
    <motion.div
      animate={{
        x: x,
        y: y,
        scale: scale,
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute -z-10 mix-blend-multiply rounded-full filter blur-2xl w-50 h-50 ${positionStyles} `}
    ></motion.div>
  );
}

export default BlobAnimation;
