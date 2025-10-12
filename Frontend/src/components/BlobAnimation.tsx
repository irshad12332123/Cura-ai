import { motion } from "framer-motion";

interface BlobAnimationProps {
  x: number[] | string;           
  y: number[] | string;           
  scale: number[];          
  duration: number;             
  positionStyles?: string;      
}

const BlobAnimation: React.FC<BlobAnimationProps> = ({
  x,
  y,
  scale,
  duration,
  positionStyles = "",
}) => {
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
      className={`absolute mix-blend-multiply rounded-full filter    ${positionStyles}`}
    />
  );
};

export default BlobAnimation;
