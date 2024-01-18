"use client";
import { useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { AnimatePresence, motion } from "framer-motion";

type Item = {
  name: string;
  value: string;
};

type Section = {
  title: string;
  items: Item[];
};

type DataProp = Section[];

type SetProductSort = (value: string) => void;

type SortAccordionProps = {
  data: DataProp;
  setProductSort: SetProductSort;
  sort: undefined | number;
  setSort: (value: undefined | number) => void;
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

function SortAccordion({
  data,
  setProductSort,
  sort,
  setSort,
}: SortAccordionProps) {
  const [active, setActive] = useState(true);
  return (
    <div className="h-[100%] flex flex-col justify-evenly">
      {data.map((section, index) => (
        <div key={index} className="px-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => {
              setActive(!active);
            }}
          >
            <span className="uppercase text-sm w-fit">{section.title}</span>
            {
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
            }
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
                        value={item.value}
                        className="py-2 cursor-pointer w-fit text-xs font-[300]"
                        onClick={() => {
                          setProductSort(item.value);
                          setSort(i);
                        }}
                      >
                        {item.name}
                      </li>
                      {sort === i && <CheckIcon className="text-sm" />}
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

export default SortAccordion;
