import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import img1 from "../../public/omega-slider-1.avif";
import img2 from "../../public/omega-silder-2.avif";
import img3 from "../../public/AT39-ZK-medium_5.jpg";
import img4 from "../../public/omega-slider-3.avif";
import img5 from "../../public/kv-main-sp-m-tablet.jpg";
import img6 from "../../public/304.33.44.52.03.001_closeup.png";
import Image from "next/image";

const data = [
  {
    mainImage: img1,
    secondaryImage: img2,
    title: "planet ocean dark gray",
    subtitle: "light yet strong. new ceramic",
    buttonText: "Discover more",
    link: "/yourwatch/planet-ocean-600m-co-axial-master-chronometer-gmt-45-5-mm",
  },
  {
    mainImage: img3,
    secondaryImage: img4,
    title: "Every shape of you",
    subtitle: "aqua rerra shades",
    buttonText: "Discover the collection",
    link: "/Collection",
  },
  {
    mainImage: img5,
    secondaryImage: img6,
    title: "Winter Tales",
    subtitle: "speedmaster",
    buttonText: "Discover more",
    link: "/Collection/speedmaster",
  },
];

const mainImg = {
  initial: {
    opacity: 0,
    scale: 1.1,
    x: -20,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    x: -20,
    y: 20,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function HeroImages({ activeIndex }: { activeIndex: number }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {data.map(
        (item, i) =>
          i === activeIndex && (
            <motion.div
              key={i}
              className="relative h-[100%] w-[100%]"
              variants={mainImg}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Image
                src={item.mainImage}
                alt={item.title}
                fill={true}
                sizes="50vw"
                priority={true}
                className="object-cover"
              />
            </motion.div>
          )
      )}
    </AnimatePresence>
  );
}

export default HeroImages;
