"use client";
import { useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";

type Section = {
  title: string;
  items: string[];
};

type DataProp = Section[];

const accordian = {
  initial: {
    height: 0,
    opacity: 0,
  },
  animate: {
    height: "auto",
    opacity: 1,
    transition: { type: "tween", duration: 0.5 },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { type: "tween", duration: 0.5 },
  },
};

function Accordions({ data }: { data: DataProp }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col justify-evenly py-5">
      {data.map((section, index) => (
        <div key={index} className="px-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setActiveIndex(index === activeIndex ? null : index)}
          >
            <span className="uppercase text-base md:text-lg w-fit">
              {section.title}
            </span>
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
          <AnimatePresence mode="wait">
            {index === activeIndex && (
              <motion.div
                className=""
                variants={accordian}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ul className="pt-2">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="py-2 cursor-pointer w-fit md:text-sm font-[300]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default Accordions;
