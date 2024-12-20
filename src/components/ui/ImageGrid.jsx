// components/ui/ImageGrid.jsx

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ImageGrid = ({ images }) => {
  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };

  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      {/* Première rangée d'images */}
      <div className="flex flex-row -ml-20">
        {images.map((img, idx) => (
          <motion.div
            variants={imageVariants}
            key={`image-grid-first-${idx}`}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <img
              src={img}
              alt={`Image ${idx + 1}`}
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>
      
      {/* Deuxième rangée d'images */}
      <div className="flex flex-row">
        {images.map((img, idx) => (
          <motion.div
            key={`image-grid-second-${idx}`}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <img
              src={img}
              alt={`Image ${idx + 1}`}
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>

      {/* Gradients pour un effet de fondu aux bords */}
         </div>
  );
};

export default ImageGrid;
