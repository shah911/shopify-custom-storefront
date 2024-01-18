"use client";
import { useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { AnimatePresence, motion } from "framer-motion";

type Section = {
  title: string;
  items: string[];
};

type DataProp = Section[];

type AccordionsProps = {
  data: DataProp;
  accessories?: boolean;
  setSelectedOption: (value: string) => void;
  option: undefined | number;
  setOption: (value: number | undefined) => void;
};

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

function Accordions({
  data,
  accessories,
  setSelectedOption,
  option,
  setOption,
}: AccordionsProps) {
  const [active, setActive] = useState(true);

  return (
    <div className="h-[100%] flex flex-col justify-evenly">
      {data.map((section, index) => (
        <div key={index} className="px-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setActive(!active)}
          >
            <span className="uppercase text-sm w-fit">{section.title}</span>
            <div>
              {active ? (
                <span>
                  <Remove className="text-lg" />
                </span>
              ) : (
                <span>
                  <Add className="text-lg" />
                </span>
              )}
            </div>
          </div>
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                variants={accordian}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ul className="text-[12px] capitalize">
                  {section.items.map((item, i) => (
                    <div className="flex items-center gap-2" key={i}>
                      <li
                        className="py-2 cursor-pointer w-fit text-xs font-[300]"
                        onClick={() => {
                          setSelectedOption(item);
                          setOption(i);
                        }}
                      >
                        {item}
                      </li>
                      {option === i && <CheckIcon className="text-sm" />}
                    </div>
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
