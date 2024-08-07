import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import img1 from "../../public/omega-slider-1.avif";
import img2 from "../../public/omega-silder-2.avif";
import img3 from "../../public/AT39-ZK-medium_5.jpg";
import img4 from "../../public/omega-slider-3.avif";
import img5 from "../../public/kv-main-sp-m-tablet.jpg";
import img6 from "../../public/304.33.44.52.03.001_closeup.png";

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

const desc = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

function HeroSubSection({ activeIndex }: { activeIndex: number }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {data.map(
        (item, i) =>
          i === activeIndex && (
            <motion.div
              key={i}
              className="lg:h-[100%] flex flex-col items-center justify-center gap-5"
              variants={desc}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div
                className={`relative ${
                  i === 1
                    ? "md:w-[25vw] lg:w-[20vw] h-[250px] lg:h-[360px] 2xl:h-[400px] 2xl:w-[15vw] hidden md:flex"
                    : "md:w-[30vw] lg:w-[25vw] h-[125px] lg:h-[200px] 2xl:h-[250px] hidden md:flex"
                }`}
              >
                <Image
                  src={item.secondaryImage}
                  alt={item.subtitle}
                  priority={true}
                  fill={true}
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="uppercase font-[300] text-[26px] md:text-[20px] lg:text-[28px]">
                  {item.title}
                </span>
                <span className="uppercase font-light text-[15px] md:text-[10px] lg:text-[16px] tracking-[2px]">
                  {item.subtitle}
                </span>
              </div>
              <button className="btn mt-1">
                <Link href={item.link}>{item.buttonText}</Link>
              </button>
            </motion.div>
          )
      )}
    </AnimatePresence>
  );
}

export default HeroSubSection;
