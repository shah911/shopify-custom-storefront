import { useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import { sideBarData } from "./Data";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const menu = {
  initial: { scaleX: 0, transformOrigin: "left" },
  animate: {
    scaleX: 1,
    transition: {
      type: "tween",
      ease: [0.39, 0.575, 0.5649999999999999, 1],
    },
  },
  exit: {
    scaleX: 0,
    transition: { type: "tween", ease: [0.39, 0.575, 0.5649999999999999, 1] },
  },
};

const accordian = {
  initial: {
    height: 0,
    opacity: 0,
  },
  animate: {
    height: "auto",
    opacity: 1,
    transition: { ease: "easeInOut", duration: 0.3 },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { ease: "easeInOut", duration: 0.3 },
  },
};

function SideBarMenu() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <motion.div
      className="h-[100%] w-[100vw] lg:w-[30vw] 2xl:w-[25vw] 4xl:w-[20vw] z-30 bg-white overflow-y-auto scrollbar-hide"
      variants={menu}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="h-[100%] flex flex-col gap-6 p-10">
        {sideBarData.map((section, index: number) => (
          <div key={index} className="flex flex-col">
            <div
              className="flex items-center justify-between cursor-pointer py-4"
              onClick={() =>
                setActiveIndex(index === activeIndex ? null : index)
              }
            >
              <span className="uppercase text-base w-fit">{section.title}</span>
              {index === activeIndex ? (
                <span>
                  <Remove className="text-xl" />
                </span>
              ) : (
                <span>
                  <Add className="text-xl" />
                </span>
              )}
            </div>
            <hr />
            <AnimatePresence>
              {index === activeIndex && (
                <motion.div
                  variants={accordian}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <ul className="text-[12px] uppercase">
                    {section.items.map((item, i) => (
                      <li key={i} className="p-2 cursor-pointer w-fit">
                        {section.title === "accessories" ? (
                          <Link href={`/accessories/${item}`}>{item}</Link>
                        ) : (
                          <Link href={`/Collection/${item}`}>{item}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <Link href="/Collection" className="w-fit">
          <button className="btn-primary text-[14px] uppercase py-2 px-5">
            watch finder
          </button>
        </Link>
        <Link href="/myaccount">
          <button className="btn-primary text-[14px] uppercase py-2 px-6">
            My account
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

export default SideBarMenu;
