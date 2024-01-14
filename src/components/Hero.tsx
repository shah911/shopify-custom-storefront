"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PauseOutlined, PlayArrowOutlined } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const data = [
  {
    mainImage: "/omega-slider-1.avif",
    secondaryImage: "/omega-silder-2.avif",
    title: "planet ocean dark gray",
    subtitle: "light yet strong. new ceramic",
    buttonText: "Discover more",
    link: "/yourwatch/planet-ocean-600m-co-axial-master-chronometer-gmt-45-5-mm",
  },
  {
    mainImage: "/AT39-ZK-medium_5.jpg",
    secondaryImage: "/omega-slider-3.avif",
    title: "Every shape of you",
    subtitle: "aqua rerra shades",
    buttonText: "Discover the collection",
    link: "/Collection",
  },
  {
    mainImage: "/kv-main-sp-m-tablet.jpg",
    secondaryImage: "/304.33.44.52.03.001_closeup.png",
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
      duration: 1,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    x: -20,
    y: 20,
    transition: {
      duration: 1,
    },
  },
};

const desc = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.75 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.75 },
  },
};

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    if (!play) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [play]);

  return (
    <div className="flex overflow-hidden">
      <AnimatePresence mode="wait">
        {data.map(
          (item, i) =>
            i === activeIndex && (
              <div className="flex mx-auto flex-col md:flex-row" key={i}>
                <div className="w-[100vw] md:w-[50vw] h-[45vh] lg:h-[100vh] overflow-hidden">
                  <motion.div
                    className="relative h-[100%] w-[100%]"
                    variants={mainImg}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Image
                      src={item.mainImage}
                      alt=""
                      fill={true}
                      sizes="50vw"
                      className="object-cover"
                    />
                  </motion.div>
                </div>
                <div className="bg-[#f2f2f2] flex flex-col items-center justify-center h-[20vh] md:w-[50vw] md:h-[45vh] lg:h-[100vh] gap-5">
                  <motion.div
                    className="lg:w-[75vw] h-[100%] flex flex-col items-center justify-center gap-5"
                    variants={desc}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div
                      className={`relative ${
                        i === 1
                          ? "w-[20vw] h-[25vh] lg:h-[60vh] hidden md:flex"
                          : "w-[25vw] h-[12.5vh] lg:h-[30vh] hidden md:flex"
                      }`}
                    >
                      <Image
                        src={item.secondaryImage}
                        alt=""
                        fill={true}
                        sizes="25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="uppercase font-[300] text-[26px] md:text-[28px]">
                        {item.title}
                      </span>
                      <span className="uppercase font-light text-[15px] md:text-[16px] tracking-[2px]">
                        {item.subtitle}
                      </span>
                    </div>
                    <span className="btn mt-1">
                      <Link href={item.link}>{item.buttonText}</Link>
                    </span>
                  </motion.div>
                </div>
              </div>
            )
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4 absolute top-[74%] md:top-[47%] lg:top-[110%] 2xl:top-[105%] left-0 right-0">
        <div className="cursor-pointer" onClick={() => setPlay(!play)}>
          {play ? (
            <PauseOutlined className="text-[#555555]" />
          ) : (
            <PlayArrowOutlined className="text-[#555555]" />
          )}
        </div>
        {data.map((item, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-[10px] w-[10px] rounded-full cursor-pointer transition-all duration-500 hover:scale-[1.3] ${
              activeIndex === i ? "bg-transparent" : "bg-[#555555]"
            } ${
              activeIndex === i && "border-red-500 border-[2px] scale-[1.3]"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
