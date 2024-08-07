"use client";
import { useState, useEffect } from "react";
import { PauseOutlined, PlayArrowOutlined } from "@mui/icons-material";
import img1 from "../../public/omega-slider-1.avif";
import img2 from "../../public/omega-silder-2.avif";
import img3 from "../../public/AT39-ZK-medium_5.jpg";
import img4 from "../../public/omega-slider-3.avif";
import img5 from "../../public/kv-main-sp-m-tablet.jpg";
import img6 from "../../public/304.33.44.52.03.001_closeup.png";
import HeroImages from "./HeroImages";
import HeroSubSection from "./HeroSubSection";

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
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
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
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
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
    <div className="overflow-hidden">
      <div className="flex mx-auto flex-col md:flex-row overflow-hidden">
        <div className="w-[100vw] md:w-[50vw] h-[450px] lg:h-[700px] 2xl:h-[840px] 4xl:h-[960px] overflow-hidden bg-[#f2f2f2]">
          <HeroImages activeIndex={activeIndex} />
        </div>
        <div className="bg-[#f2f2f2] flex flex-col items-center justify-center h-[180px] md:w-[50vw] md:h-[450px] lg:h-[700px] 2xl:h-[840px] 4xl:h-[960px] gap-5">
          <HeroSubSection activeIndex={activeIndex} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 absolute top-[715px] md:top-[475px] lg:top-[750px] 2xl:top-[900px] 4xl:top-[1000px] left-0 right-0">
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
